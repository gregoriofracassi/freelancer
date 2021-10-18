import { Router } from "express"
import createError from "http-errors"
import CommentModel from "../../_models/comment/index.js"
import UserModel from "../../_models/user/index.js"
import { JWTAuthMiddleware } from "../../auth/middlewares.js"

const commentRouter = Router()

commentRouter.post("/:id", JWTAuthMiddleware, async (req, res) => {
  try {
    const newComment = new CommentModel(req.body)
    newComment.author = req.user
    const { _id } = await newComment.save()
    const updatedUserComments = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: newComment,
        },
      },
      {
        runValidators: true,
        new: true,
      }
    )
    res.status(201).send(updatedUserComments)
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while saving new comment"))
  }
})

commentRouter.get("/", async (req, res, next) => {
  try {
    const comment = await CommentModel.find()
    res.status(200).send(comment)
  } catch (error) {
    next(createError(500, { message: error.message }))
  }
})

commentRouter.get("/:id", async (req, res, next) => {
  try {
    const comment = await CommentModel.findById(req.params.id)
    if (!comment) next(createError(404, `ID ${req.params.id} was not found`))
    else res.status(200).send(comment)
  } catch (error) {
    next(error)
  }
})

commentRouter.put("/:id", async (req, res, next) => {
  try {
    const updateComment = await CommentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    )
    res.status(201).send(updateComment)
  } catch (error) {
    next(error)
  }
})

commentRouter.delete("/:id", async (req, res, next) => {
  try {
    const deleteComment = await CommentModel.findByIdAndDelete(req.params.id)
    if (deleteComment) res.status(201).send("Comment deleted")
    else next(createError(400, "Bad Request"))
  } catch (error) {
    next(error)
  }
})

export default commentRouter
