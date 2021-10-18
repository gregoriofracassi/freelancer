import { Router } from "express"
import createError from "http-errors"
import UserModel from "../../models/user/index.js"
import { JWTAuthenticate } from "../../auth/tools.js"
import { JWTAuthMiddleware } from "../../auth/middlewares.js"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

const usersRouter = Router()

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.checkCredentials(email, password)

    if (user) {
      const accessToken = await JWTAuthenticate(user)
      res.send({ accessToken, userId: user._id })
    } else {
      next(createError(401))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/register", async (req, res) => {
  try {
    const newUser = new UserModel(req.body)
    const { _id } = await newUser.save()

    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while saving new author"))
  }
})

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find()
    res.status(200).send(users)
  } catch (error) {
    next(createError(500, { message: error.message }))
  }
})

usersRouter.get("/specific/:id", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id).populate([
      "course",
      "uni",
      "availableSubjects",
      {
        path: "comments",
        populate: { path: "author" },
      },
    ])
    if (!user) next(createError(404, `ID ${req.params.id} was not found`))
    else res.status(200).send(user)
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id).populate([
      {
        path: "course",
        populate: { path: "subjects" },
      },
      "uni",
      "availableSubjects",
    ])
    if (!user) next(createError(404, `ID ${req.params.id} was not found`))
    else res.status(200).send(user)
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/:id", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id)
    const updateUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body } },
      {
        runValidators: true,
        new: true,
      }
    )
    res.status(201).send(updateUser)
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/:id", async (req, res, next) => {
  try {
    const deleteUser = await UserModel.findByIdAndDelete(req.params.id)
    if (deleteUser) res.status(201).send("Profile deleted")
    else next(createError(400, "Bad Request"))
  } catch (error) {
    next(error)
  }
})

// -------- ratings --------

usersRouter.post(
  "/rateNotes/:id",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const rating = req.body
      const user = await UserModel.findById(req.params.id)
      if (user) {
        const updatedUser = await UserModel.findByIdAndUpdate(
          req.params.id,
          {
            $push: {
              notesRatings: rating.rating,
            },
          },
          {
            runValidators: true,
            new: true,
          }
        )
        res.status(201).send(updatedUser)
      } else {
        next(createError(404, "user not found"))
      }
    } catch (error) {
      next(createError(500, "an error occurred while adding a notes rating"))
    }
  }
)

usersRouter.post(
  "/rateTutor/:id",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const rating = req.body
      const user = await UserModel.findById(req.params.id)
      if (user) {
        const updatedUser = await UserModel.findByIdAndUpdate(
          req.params.id,
          {
            $push: {
              tutorRatings: rating.rating,
            },
          },
          {
            runValidators: true,
            new: true,
          }
        )
        res.status(201).send(updatedUser)
      } else {
        next(createError(404, "user not found"))
      }
    } catch (error) {
      next(createError(500, "an error occurred while adding a tutor rating"))
    }
  }
)

// ------- cloudinary -------

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "UniHub",
  },
})

usersRouter.post(
  "/:id/imageupload",
  multer({ storage: cloudinaryStorage }).single("avatar"),
  async (req, res, next) => {
    try {
      const user = await UserModel.findByIdAndUpdate(
        req.params.id,
        { avatar: req.file.path },
        { runValidators: true, new: true }
      )
      if (user) {
        res.send(user)
      } else {
        next(createError(404, { message: `user ${req.params.id} not found` }))
      }
    } catch (error) {
      next(createError(500, "An error occurred while uploading user avatar"))
    }
  }
)

export default usersRouter
