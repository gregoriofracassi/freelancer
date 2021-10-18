import { Router } from "express"
import createError from "http-errors"
import SubjectModel from "../../_models/subject/index.js"
import { JWTAuthMiddleware } from "../../auth/middlewares.js"

const subjectsRouter = Router()

subjectsRouter.post("/", async (req, res) => {
  try {
    const newSubject = new SubjectModel(req.body)
    const { _id } = await newSubject.save()

    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while saving new subject"))
  }
})

subjectsRouter.get("/", async (req, res, next) => {
  try {
    const subject = await SubjectModel.find()
    res.status(200).send(subject)
  } catch (error) {
    next(createError(500, { message: error.message }))
  }
})

subjectsRouter.get("/:id", async (req, res, next) => {
  try {
    const subject = await SubjectModel.findById(req.params.id)
    if (!subject) next(createError(404, `ID ${req.params.id} was not found`))
    else res.status(200).send(subject)
  } catch (error) {
    next(error)
  }
})

subjectsRouter.put("/:id", async (req, res, next) => {
  try {
    const updateSubjects = await SubjectModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    )
    res.status(201).send(updateSubjects)
  } catch (error) {
    next(error)
  }
})

subjectsRouter.delete("/:id", async (req, res, next) => {
  try {
    const deleteSubject = await SubjectModel.findByIdAndDelete(req.params.id)
    if (deleteSubject) res.status(201).send("Subject deleted")
    else next(createError(400, "Bad Request"))
  } catch (error) {
    next(error)
  }
})

export default subjectsRouter
