import { Router } from "express"
import createError from "http-errors"
import CourseModel from "../../models/course/index.js"

const courseRouter = Router()

courseRouter.post("/", async (req, res) => {
  try {
    const newCourse = new CourseModel(req.body)
    const { _id } = await newCourse.save()

    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while saving new course"))
  }
})

courseRouter.get("/", async (req, res, next) => {
  try {
    const course = await CourseModel.find()
    res.status(200).send(course)
  } catch (error) {
    next(createError(500, { message: error.message }))
  }
})

courseRouter.get("/:id", async (req, res, next) => {
  try {
    const course = await CourseModel.findById(req.params.id)
    if (!course) next(createError(404, `ID ${req.params.id} was not found`))
    else res.status(200).send(course)
  } catch (error) {
    next(error)
  }
})

courseRouter.put("/:id", async (req, res, next) => {
  try {
    const updateCourse = await CourseModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    )
    res.status(201).send(updateCourse)
  } catch (error) {
    next(error)
  }
})

courseRouter.delete("/:id", async (req, res, next) => {
  try {
    const deleteCourse = await CourseModel.findByIdAndDelete(req.params.id)
    if (deleteCourse) res.status(201).send("Course deleted")
    else next(createError(400, "Bad Request"))
  } catch (error) {
    next(error)
  }
})

export default courseRouter
