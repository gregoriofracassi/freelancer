import cors from "cors"
import express from "express"
import usersRouter from "./services/users/index.js"
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  forbiddenErrorHandler,
  catchAllErrorHandler,
} from "./errorHandlers.js"

const server = express()
server.use(cors())
server.use(express.json())

server.use("/users", usersRouter)

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(catchAllErrorHandler)

export default server
