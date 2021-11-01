import cors from "cors"
import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import usersRouter from "./services/users/index.js"
import coursesRouter from "./services/courses/index.js"
import subjectsRouter from "./services/subjects/index.js"
import notesRouter from "./services/notes/index.js"
import unisRouter from "./services/unis/index.js"
import tutorSessionsRouter from "./services/tutorSessions/index.js"
import searchRouter from "./services/search/index.js"
import commentsRouter from "./services/comments/index.js"
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  forbiddenErrorHandler,
  catchAllErrorHandler,
  unauthorizedErrorHandler,
} from "./errorHandlers.js"

const server = express()

const whitelist = ["http://localhost:3000", "https://unihub-flax.vercel.app"]

const corsOptions = {
  origin: function (origin, next) {
    if (!origin || whitelist.includes(origin)) {
      next(null, true)
    } else {
      next(new Error("Origin is not supported!"))
    }
  },
}

server.use(cors(corsOptions))
server.use(express.json())

const socketServer = createServer(server)
const io = new Server(socketServer, {
  cors: {
    origin: "https://unihub-flax.vercel.app",
    methods: ["GET", "POST"],
  },
})

const users = {}

io.on("connection", (socket) => {
  socket.emit("yourID", socket.id)

  socket.on("setMyId", (userData) => {
    users[userData.userId] = socket.id

    io.sockets.emit("allUsers", users)
    console.log(users)
  })

  socket.on("disconnect", () => {
    let key = ""
    for (const [k, v] of Object.entries(users)) {
      if (v === socket.id) key = k
    }
    delete users[key]
    console.log(users)
    socket.broadcast.emit("user left", users)
  })

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("hey", {
      signal: data.signalData,
      from: data.from,
    })
  })

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal)
  })

  socket.on("callEnded", (data) => {
    io.to(users[data.user]).emit("callOver")
    console.log("received call ended")
  })
})

server.use("/users", usersRouter)
server.use("/unis", unisRouter)
server.use("/courses", coursesRouter)
server.use("/subjects", subjectsRouter)
server.use("/tutorSessions", tutorSessionsRouter)
server.use("/notes", notesRouter)
server.use("/comments", commentsRouter)
server.use("/search", searchRouter)

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(unauthorizedErrorHandler)
server.use(catchAllErrorHandler)

export { server }
export default socketServer
