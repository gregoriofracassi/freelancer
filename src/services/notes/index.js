import { Router } from "express"
import createError from "http-errors"
import NotesModel from "../../models/notes/index.js"
import { JWTAuthenticate } from "../../auth/tools.js"
import { JWTAuthMiddleware } from "../../auth/middlewares.js"

const notesRouter = Router()

notesRouter.post("/", JWTAuthMiddleware, async (req, res) => {
  try {
    const newNotes = new NotesModel(req.body)
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

export default notesRouter
