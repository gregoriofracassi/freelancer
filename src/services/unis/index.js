import { Router } from "express"
import createError from "http-errors"
import UniModel from "../../_models/uni/index.js"

const uniRouter = Router()

uniRouter.post("/", async (req, res) => {
  try {
    const newUni = new UniModel(req.body)
    const { _id } = await newUni.save()

    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while saving new uni"))
  }
})

uniRouter.get("/", async (req, res, next) => {
  try {
    const uni = await UniModel.find()
    res.status(200).send(uni)
  } catch (error) {
    next(createError(500, { message: error.message }))
  }
})

uniRouter.get("/:id", async (req, res, next) => {
  try {
    const uni = await UniModel.findById(req.params.id)
    if (!uni) next(createError(404, `ID ${req.params.id} was not found`))
    else res.status(200).send(uni)
  } catch (error) {
    next(error)
  }
})

uniRouter.put("/:id", async (req, res, next) => {
  try {
    const updateUni = await UniModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    )
    res.status(201).send(updateUni)
  } catch (error) {
    next(error)
  }
})

uniRouter.delete("/:id", async (req, res, next) => {
  try {
    const deleteUni = await UniModel.findByIdAndDelete(req.params.id)
    if (deleteUni) res.status(201).send("Uni deleted")
    else next(createError(400, "Bad Request"))
  } catch (error) {
    next(error)
  }
})

export default uniRouter
