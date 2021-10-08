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
    console.log(req.user)
    const result = {
      uni: { notes: [], sessions: [], users: [] },
      other: { notes: [], sessions: [], users: [] },
    }
    const queryObj = q2m(req.query)
    console.log(queryObj)
    const querySubject = await SubjectModel.findOne({
      subject: queryObj.criteria.key,
    })
    if (querySubject) {
      const allTutorSessions = await TutorSessionsModel.find({
        subject: querySubject._id,
      })
      if (allTutorSessions.length !== 0) {
        allTutorSessions.forEach((sess) => {
          if (sess.uni === req.user.uni) {
            result.uni.sessions.push(sess)
          } else {
            result.other.sessions.push(sess)
          }
        })
      }

      const allNotes = await NotesModel.find({
        subject: querySubject._id,
      })
      if (allNotes.length !== 0) {
        allNotes.forEach((notes) => {
          if (notes.uni === req.user.uni) {
            result.uni.notes.push(notes)
          } else {
            result.other.notes.push(notes)
          }
        })
      }
    }

    const allUsers = await UserModel.find({
      $or: [
        { name: queryObj.criteria.key },
        { surname: queryObj.criteria.key },
      ],
    })
    if (allUsers.length !== 0) {
      allUsers.forEach((user) => {
        if (user.uni === req.user.uni) {
          result.uni.users.push(user)
        } else {
          result.other.users.push(user)
        }
      })
    }
    console.log(result)
    res.status(200).send("eapfj")
  } catch (error) {
    next(createError(500, { message: error.message }))
  }
})

export default searchRouter
