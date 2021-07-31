import express from "express"
import createError from "http-errors"
import ProjectModel from "../../models/project/index.js"
import q2m from "query-to-mongo"

const projectsRouter = express.Router()

projectsRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query)
    console.log(query)
    const total = await ProjectModel.countDocuments(query.criteria)
    const projects = await ProjectModel.find(
      query.criteria,
      query.options.fields
    )
      .sort(query.options.sort)
      .skip(query.options.skip)
      .limit(query.options.limit)
    res.send({ link: query.links("/projects", total), total, projects })
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while getting the project"))
  }
})

projectsRouter.post("/", async (req, res, next) => {
  try {
    const newProject = new ProjectModel(req.body)
    const response = await newProject.save()
    res.status(201).send(response._id)
  } catch (error) {
    console.log(error)
    next(createError(500, error))
  }
})

projectsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const project = await ProjectModel.findById(id)
    if (project) {
      res.send(project)
    } else {
      next(createError(404, `Project ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(
      createError(500, "An error occurred while getting the specified project")
    )
  }
})

projectsRouter.put("/:id", async (req, res, next) => {
  try {
    const project = await ProjectModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    )
    if (project) {
      res.send(project)
    } else {
      next(createError(404, `Project ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while modifying the project"))
  }
})

projectsRouter.delete("/:id", async (req, res, next) => {
  try {
    const project = await ProjectModel.findByIdAndDelete(req.params.id)
    if (project) {
      res.status(204).send(`Succesfully deleted project ${req.params.id}`)
    } else {
      next(createError(404, `project ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while deleting the project"))
  }
})

export default projectsRouter
