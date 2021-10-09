import { Router } from "express"
import createError from "http-errors"
import TutorSessionsModel from "../../models/tutorSession/index.js"
import UniModel from "../../models/uni/index.js"
import NotesModel from "../../models/notes/index.js"
import UserModel from "../../models/user/index.js"
import SubjectModel from "../../models/subject/index.js"
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
      const usersWithSubj = await UserModel.find({
        availableSubjects: querySubject._id,
      })
      if (usersWithSubj.length !== 0) {
        usersWithSubj.forEach((user) => {
          if (user._id.toString() !== req.user._id.toString()) {
            if (user.uni.toString() === req.user.uni.toString()) {
              result.uni.sessions.push(user)
            } else {
              result.other.sessions.push(user)
            }
          }
        })
      }

      const allNotes = await NotesModel.find({
        subject: querySubject._id,
      })
      if (allNotes.length !== 0) {
        allNotes.forEach((notes) => {
          if (notes.author.toString() !== req.user._id.toString()) {
            if (notes.uni.toString() === req.user.uni.toString()) {
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
    })
    if (allUsers.length !== 0) {
      allUsers.forEach((user) => {
        if (user._id.toString() !== req.user._id.toString()) {
          if (user.uni === req.user.uni) {
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
