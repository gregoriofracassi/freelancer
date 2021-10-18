import { Router } from "express"
import createError from "http-errors"
import NotesModel from "../../_models/notes/index.js"
import UserModel from "../../_models/user/index.js"
import SubjectModel from "../../_models/subject/index.js"
import q2m from "query-to-mongo"
import { JWTAuthMiddleware } from "../../auth/middlewares.js"

const searchRouter = Router()

searchRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const result = {
      uni: { notes: [], sessions: [], users: [] },
      other: { notes: [], sessions: [], users: [] },
    }
    const queryObj = q2m(req.query)
    console.log(queryObj)

    // ------------ search through subjects ------------
    const querySubject = await SubjectModel.findOne({
      subject: new RegExp(queryObj.criteria.key, "i"),
    })
    if (querySubject) {
      result.subject = querySubject
      const usersWithSubj = await UserModel.find({
        availableSubjects: querySubject._id,
      }).populate(["course", "uni"])
      if (usersWithSubj.length !== 0) {
        usersWithSubj.forEach((user) => {
          if (user._id.toString() !== req.user._id.toString()) {
            if (user.uni._id.toString() === req.user.uni.toString()) {
              result.uni.sessions.push(user)
            } else {
              result.other.sessions.push(user)
            }
          }
        })
      }

      const allNotes = await NotesModel.find({
        subject: querySubject._id,
      }).populate(["author", "course", "uni"])
      if (allNotes.length !== 0) {
        allNotes.forEach((notes) => {
          if (notes.author._id.toString() !== req.user._id.toString()) {
            if (notes.uni._id.toString() === req.user.uni.toString()) {
              result.uni.notes.push(notes)
            } else {
              result.other.notes.push(notes)
            }
          }
        })
      }
    }

    // ------------- search through users -------------
    const allUsers = await UserModel.find({
      $or: [
        { name: new RegExp(queryObj.criteria.key, "i") },
        { surname: new RegExp(queryObj.criteria.key, "i") },
      ],
    }).populate(["uni", "course"])
    if (allUsers.length !== 0) {
      allUsers.forEach((user) => {
        if (user._id.toString() !== req.user._id.toString()) {
          if (user.uni._id.toString() === req.user.uni._id.toString()) {
            result.uni.users.push(user)
          } else {
            result.other.users.push(user)
          }
        }
      })
    }
    res.status(200).send(result)
  } catch (error) {
    next(createError(500, { message: error.message }))
  }
})

export default searchRouter
