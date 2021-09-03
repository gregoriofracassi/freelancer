import cors from "cors"
import express from "express"
import usersRouter from "./services/users/index.js"
import coursesRouter from "./services/courses/index.js"
import subjectsRouter from "./services/subjects/index.js"
import notesRouter from "./services/notes/index.js"
import unisRouter from "./services/unis/index.js"
import groupStudiesRouter from "./services/groupStudies/index.js"
import tutorSessionsRouter from "./services/tutorSessions/index.js"
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  forbiddenErrorHandler,
  catchAllErrorHandler,
  unauthorizedErrorHandler,
} from "./errorHandlers.js"

const server = express()
server.use(cors())
server.use(express.json())

server.use("/users", usersRouter)
server.use("/unis", unisRouter)
server.use("/courses", coursesRouter)
server.use("/subjects", subjectsRouter)
server.use("/tutorSessions", tutorSessionsRouter)
server.use("/notes", notesRouter)
server.use("/groupStudy", groupStudiesRouter)

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(unauthorizedErrorHandler)
server.use(catchAllErrorHandler)

export default server
