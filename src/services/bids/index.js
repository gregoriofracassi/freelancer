import express from "express"
import createError from "http-errors"
import BidModel from "../../models/bid/index.js"
import q2m from "query-to-mongo"

const bidsRouter = express.Router()

bidsRouter.get("/", async (req, res, next) => {
  try {
    const bids = await BidModel.find()
    res.status(200).send(bids)
  } catch (error) {
    next(createError(500, { message: error.message }))
  }
})

bidsRouter.post("/", async (req, res, next) => {
  try {
    const newBid = new BidModel(req.body)
    const { id } = await newBid.save()
    res.status(201).send(id)
  } catch (error) {
    console.log(error)
    next(createError(500, error))
  }
})

bidsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const bid = await BidModel.findById(id)
    if (bid) {
      res.send(bid)
    } else {
      next(createError(404, `bid ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while getting the specified bid"))
  }
})

bidsRouter.put("/:id", async (req, res, next) => {
  try {
    const bid = await BidModel.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    })
    if (bid) {
      res.send(bid)
    } else {
      next(createError(404, `bid ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while modifying the bid"))
  }
})

bidsRouter.delete("/:id", async (req, res, next) => {
  try {
    const bid = await BidModel.findByIdAndDelete(req.params.id)
    if (bid) {
      res.status(204).send(`Succesfully deleted bid ${req.params.id}`)
    } else {
      next(createError(404, `bid ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while deleting the bid"))
  }
})

export default bidsRouter
