import { Router } from "express"
import RoomModel from "../../models/Room/index.js"
import createError from "create-error"
import { JWTAuthMiddleware } from "../../auth/middlewares.js"
import { onlineUsers } from "../../server.js"

const roomsRouter = Router()

roomsRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const newRoom = new RoomModel(req.body)
    newRoom.users.push(req.user) //check
    const response = await newRoom.save()
    res.status(201).send(response._id)
  } catch (error) {
    console.log(error)
    if (error.name === "ValidationError") {
      next(createError(400, error))
    } else {
      next(createError(500, error))
    }
  }
})

roomsRouter.post(
  "/:id/addUser/:userId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const room = await RoomModel.findById(req.params.id)
      if (room) {
        const updateRoomUsers = await RoomModel.findByIdAndUpdate(
          req.params.id,
          {
            $push: {
              users: req.params.userId,
            },
          },
          {
            runValidators: true,
            new: true,
          }
        )
        res.status(201).send(updateRoomUsers)
      } else {
        next(createError(404, "post not found"))
      }
    } catch (error) {
      next(createError(500, "an error occurred while adding a user to a room"))
    }
  }
)

roomsRouter.get("/myRooms", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const rooms = await RoomModel.find({ users: req.user }).populate("users")

    // const mysocket = onlineUsers[req.user._id]
    // for (let room of rooms) mysocket.join(room._id.toString())

    //console.log(mysocket.rooms)

    if (rooms) {
      res.status(200).send({ rooms, myId: req.user._id })
    } else {
      next(createError(404, "No user found"))
    }
  } catch (error) {
    console.log(error)
  }
})

roomsRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const room = await RoomModel.findById(req.params.id)
    if (room) {
      res.status(200).send(room)
    } else {
      next(createError(404, "No user found"))
    }
  } catch (error) {
    console.log(error)
  }
})

roomsRouter.post(
  "/:id/addMessage",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const room = await RoomModel.findById(req.params.id)
      if (room) {
        req.body.sender = req.user._id
        const updateChatHistory = await RoomModel.findByIdAndUpdate(
          req.params.id,
          {
            $push: {
              chatHistory: req.body,
            },
          },
          {
            runValidators: true,
            new: true,
          }
        )
        res.status(201).send(updateChatHistory)
      } else {
        next(createError(404, "post not found"))
      }
    } catch (error) {
      next(createError(500, "an error occurred while adding a user to a room"))
    }
  }
)

export default roomsRouter
