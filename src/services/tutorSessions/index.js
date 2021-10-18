import { Router } from "express"
import createError from "http-errors"
import TutorSessionModel from "../../models/tutorSession/index.js"
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
  "/specific/:id",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const tutorSession = await TutorSessionModel.findById(
        req.params.id
      ).populate(["course", "tutor", "student", "subject"])
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
    const durations = [
      "30m",
      "1h",
      "1h 30m",
      "2h",
      "2h 30m",
      "3h",
      "3h 30m",
      "4h",
    ]
    try {
      const updateTutorSession = await TutorSessionModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            student: req.user,
            subject: req.body.subject,
            duration: durations[req.body.duration - 1],
          },
        },
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
