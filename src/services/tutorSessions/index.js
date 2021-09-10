import { Router } from "express"
import createError from "http-errors"
import TutorSessionModel from "../../models/tutorSession/index.js"
import { JWTAuthenticate } from "../../auth/tools.js"
import { JWTAuthMiddleware } from "../../auth/middlewares.js"

const tutorSessionsRouter = Router()

tutorSessionsRouter.post("/", JWTAuthMiddleware, async (req, res) => {
  try {
    const newTutorSession = new TutorSessionModel(req.body)
    newTutorSession.tutor = req.user
    const { _id } = await newTutorSession.save()

    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while saving new tutor session"))
  }
})

tutorSessionsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const tutorSession = await TutorSessionModel.find()
    res.status(200).send(tutorSession)
  } catch (error) {
    next(createError(500, { message: error.message }))
  }
})

tutorSessionsRouter.get(
  "/individual_session/:id",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const tutorSession = await TutorSessionModel.findById(req.params.id)
      if (!tutorSession)
        next(createError(404, `ID ${req.params.id} was not found`))
      else res.status(200).send(tutorSession)
    } catch (error) {
      next(error)
    }
  }
)

tutorSessionsRouter.get(
  "/byTutor/:id",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const tutorSession = await TutorSessionModel.find({
        tutor: req.params.id,
      }).populate([
        {
          path: "student",
          populate: { path: "uni" },
        },
        {
          path: "subject",
        },
      ])
      if (!tutorSession)
        next(createError(404, `ID ${req.params.id} was not found`))
      else res.status(200).send(tutorSession)
    } catch (error) {
      next(error)
    }
  }
)

tutorSessionsRouter.get(
  "/byStudent/:id",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const tutorSession = await TutorSessionModel.find({
        student: req.params.id,
      }).populate([
        {
          path: "tutor",
          populate: { path: "uni" },
        },
        {
          path: "subject",
        },
      ])
      if (!tutorSession)
        next(createError(404, `ID ${req.params.id} was not found`))
      else res.status(200).send(tutorSession)
    } catch (error) {
      next(error)
    }
  }
)

tutorSessionsRouter.put(
  "/book/:id",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const updateTutorSession = await TutorSessionModel.findByIdAndUpdate(
        req.params.id,
        { $set: { student: req.user, subject: req.body.subject } },
        {
          runValidators: true,
          new: true,
        }
      )
      res.status(201).send(updateTutorSession)
    } catch (error) {
      next(error)
    }
  }
)

tutorSessionsRouter.put("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updateTutorSession = await TutorSessionModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    )
    res.status(201).send(updateTutorSession)
  } catch (error) {
    next(error)
  }
})

tutorSessionsRouter.delete(
  "/:id",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const deleteTutorSession = await TutorSessionModel.findByIdAndDelete(
        req.params.id
      )
      if (deleteTutorSession) res.status(201).send("Notes deleted")
      else next(createError(400, "Bad Request"))
    } catch (error) {
      next(error)
    }
  }
)

export default tutorSessionsRouter
