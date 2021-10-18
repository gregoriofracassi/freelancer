import { Router } from "express"
import createError from "http-errors"
import NotesModel from "../../_models/notes/index.js"
import UserModel from "../../_models/user/index.js"
import multer from "multer"
import AWS from "aws-sdk"
import { v4 as uuidv4 } from "uuid"
import { JWTAuthMiddleware } from "../../auth/middlewares.js"
import { pipeline } from "stream"

const notesRouter = Router()

notesRouter.post("/", JWTAuthMiddleware, async (req, res) => {
  try {
    const newNotes = new NotesModel(req.body)
    newNotes.author = req.user
    newNotes.uni = req.user.uni
    const { _id } = await newNotes.save()

    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while saving new notes"))
  }
})

notesRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const notes = await NotesModel.find()
    res.status(200).send(notes)
  } catch (error) {
    next(createError(500, { message: error.message }))
  }
})

notesRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const notes = await NotesModel.findById(req.params.id)
    if (!notes) next(createError(404, `ID ${req.params.id} was not found`))
    else res.status(200).send(notes)
  } catch (error) {
    next(error)
  }
})

notesRouter.put("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updateNotes = await NotesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    )
    res.status(201).send(updateNotes)
  } catch (error) {
    next(error)
  }
})

notesRouter.delete("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const deleteNotes = await NotesModel.findByIdAndDelete(req.params.id)
    if (deleteNotes) res.status(201).send("Notes deleted")
    else next(createError(400, "Bad Request"))
  } catch (error) {
    next(error)
  }
})

notesRouter.get("/byAuthor/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const notes = await NotesModel.find({
      author: req.params.id,
    }).populate([
      {
        path: "author",
        populate: { path: "uni" },
      },
      {
        path: "subject",
      },
      {
        path: "course",
      },
    ])
    if (!notes) next(createError(404, `ID ${req.params.id} was not found`))
    else res.status(200).send(notes)
  } catch (error) {
    next(error)
  }
})

notesRouter.get(
  "/byPurchaser/:id",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const notes = await NotesModel.find({
        purchasedBy: req.params.id,
      }).populate([
        {
          path: "author",
          populate: { path: "uni" },
        },
        {
          path: "subject",
        },
        {
          path: "course",
        },
      ])
      if (!notes) next(createError(404, `ID ${req.params.id} was not found`))
      else res.status(200).send(notes)
    } catch (error) {
      next(error)
    }
  }
)

notesRouter.post("/:id/purchase", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const notes = await NotesModel.findById(req.params.id)
    if (notes) {
      const updatedNotes = await NotesModel.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            purchasedBy: req.user._id,
          },
        },
        {
          runValidators: true,
          new: true,
        }
      )
      res.status(201).send(updatedNotes)
    } else {
      next(createError(404, "notes not found"))
    }
  } catch (error) {
    next(createError(500, "an error occurred while adding a purchaser"))
  }
})

// ---------------upload/download notes pdf------------------

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
})

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "")
  },
})

notesRouter.post(
  "/upload",
  multer({ storage }).single("image"),
  (req, res, next) => {
    let myFile = req.file.originalname.split(".")
    const fileType = myFile[myFile.length - 1]

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${uuidv4()}.${fileType}`,
      Body: req.file.buffer,
    }

    s3.upload(params, (error, data) => {
      if (error) {
        res.status(500).send(error)
      }

      res.status(200).send(data)
    })
  }
)

notesRouter.get("/download/:key", JWTAuthMiddleware, (req, res, next) => {
  try {
    const options = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: req.params.key,
    }
    const fileStream = s3.getObject(options).createReadStream()
    res.setHeader("Content-Disposition", "attachment; filename=export.pdf")
    pipeline(fileStream, res, (err) => next(err))
  } catch (error) {
    console.log(error)
    next(createError(500, "problems with notes download"))
  }
})

export default notesRouter
