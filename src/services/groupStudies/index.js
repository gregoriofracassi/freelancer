import { Router } from "express"
import createError from "http-errors"
import GroupStudyModel from "../../models/GroupStudy/index.js"
import { JWTAuthenticate } from "../../auth/tools.js"
import { JWTAuthMiddleware } from "../../auth/middlewares.js"

const groupStudiesRouter = Router()

groupStudiesRouter.post("/", JWTAuthMiddleware, async (req, res) => {
  try {
    const newGroupStudy = new GroupStudyModel(req.body)
    const { _id } = await newGroupStudy.save()

    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while saving new groupStudy"))
  }
})

groupStudiesRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const groupStudy = await GroupStudyModel.find()
    res.status(200).send(groupStudy)
  } catch (error) {
    next(createError(500, { message: error.message }))
  }
})

groupStudiesRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const groupStudy = await GroupStudyModel.findById(req.params.id)
    if (!groupStudy) next(createError(404, `ID ${req.params.id} was not found`))
    else res.status(200).send(groupStudy)
  } catch (error) {
    next(error)
  }
})

groupStudiesRouter.put("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updateGroupStudy = await GroupStudyModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    )
    res.status(201).send(updateGroupStudy)
  } catch (error) {
    next(error)
  }
})

groupStudiesRouter.delete("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const deleteGroupStudy = await GroupStudyModel.findByIdAndDelete(
      req.params.id
    )
    if (deleteGroupStudy) res.status(201).send("GroupStudy deleted")
    else next(createError(400, "Bad Request"))
  } catch (error) {
    next(error)
  }
})

export default groupStudiesRouter
