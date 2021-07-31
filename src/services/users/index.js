import { Router } from "express";
import createError from "http-errors";
import UserModel from "../../models/User/index.js";
import { JWTAuthenticate } from "../../auth/tools.js";
import { JWTAuthMiddleware } from "../../auth/middlewares.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const usersRouter = Router();

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const user = await UserModel.checkCredentials(email, password);

    if (user) {
      console.log("credentials are fine");
      const accessToken = await JWTAuthenticate(user);
      console.log("token", accessToken);
      res.send({ accessToken, userId: user._id });
    } else {
      next(createError(401));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const user = await UserModel.checkCredentials(email, password);

    if (user) {
      console.log("credentials are fine");
      const accessToken = await JWTAuthenticate(user);
      console.log("token", accessToken);
      res.send({ accessToken, userId: user._id });
    } else {
      next(createError(401));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/", async (req, res) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();

    res.status(201).send(_id);
  } catch (error) {
    console.log(error);
    next(createError(500, "An error occurred while saving new author"));
  }
});

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.status(200).send(users);
  } catch (error) {
    next(createError(500, { message: error.message }));
  }
});

usersRouter.get("/search", JWTAuthMiddleware, async (req, res, next) => {
  console.log(req.query);
  const { username } = req.query;
  try {
    const users = await UserModel.find({ username }, { email: 0 });

    if (users) {
      res.status(200).send(users);
    }
    res.send(createError(404, "No user found"));
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:id", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) next(createError(404, `ID ${req.params.id} was not found`));
    else res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/:id", async (req, res, next) => {
  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    res.status(201).send(updateUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/:id", async (req, res, next) => {
  try {
    const deleteUser = await UserModel.findByIdAndDelete(req.params.id);
    if (deleteUser) res.status(201).send("Profile deleted");
    else next(createError(400, "Bad Request"));
  } catch (error) {
    next(error);
  }
});

//------------------------------------CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: "whatsapp" },
});
const upload = multer({
  storage: cloudinaryStorage,
}).single("image");

usersRouter.post("/:id/upload", upload, async (req, res, next) => {
  try {
    const data = await UserModel.findByIdAndUpdate(
      { _id: req.params.id },
      { avatar: req.file.path },
      { new: true, runValidators: true }
    );
    console.log(data);
    if (data[0] === 1) res.send(data[1][0]);
    else res.status(404).send("ID not found");
  } catch (error) {
    console.log(error);
    next(error.message);
  }
});

export default usersRouter;
