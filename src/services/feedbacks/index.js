import express from "express"
import createError from "http-errors"
import FeedbackModel from "../../models/feedback/index.js"
import q2m from "query-to-mongo"

const feedbacksRouter = express.Router()

feedbacksRouter.get("/", async (req, res, next) => {
  try {
    const feedbacks = await FeedbackModel.find()
    res.status(200).send(feedbacks)
  } catch (error) {
    next(createError(500, { message: error.message }))
  }
})

feedbacksRouter.post("/", async (req, res, next) => {
  try {
    const newFeedback = new FeedbackModel(req.body)
    const { id } = await newFeedback.save()
    res.status(201).send(id)
  } catch (error) {
    console.log(error)
    next(createError(500, error))
  }
})

feedbacksRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const feedback = await FeedbackModel.findById(id)
    if (feedback) {
      res.send(feedback)
    } else {
      next(createError(404, `feedback ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(
      createError(500, "An error occurred while getting the specified feedback")
    )
  }
})

feedbacksRouter.put("/:id", async (req, res, next) => {
  try {
    const feedback = await FeedbackModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    )
    if (feedback) {
      res.send(feedback)
    } else {
      next(createError(404, `feedback ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while modifying the feedback"))
  }
})

feedbacksRouter.delete("/:id", async (req, res, next) => {
  try {
    const feedback = await FeedbackModel.findByIdAndDelete(req.params.id)
    if (feedback) {
      res.status(204).send(`Succesfully deleted feedback ${req.params.id}`)
    } else {
      next(createError(404, `feedback ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while deleting the feedback"))
  }
})

export default feedbacksRouter
