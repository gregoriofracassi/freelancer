import mongoose from "mongoose"
import bcrypt from "bcrypt"

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  about: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "User"],
    default: "User",
  },
  avatar: {
    type: String,
    default: "https://image.flaticon.com/icons/png/512/5173/5173555.png",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  uni: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Uni",
  },
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      default: [],
    },
  ],
  availableSubjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      default: [],
    },
  ],
  hourlyFee: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: [],
    },
  ],
  notesRatings: [
    {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: [],
    },
  ],
  tutorRatings: [
    {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: [],
    },
  ],
})

UserSchema.pre("save", async function (next) {
  const newUser = this
  const plainPw = newUser.password

  if (newUser.isModified("password")) {
    newUser.password = await bcrypt.hash(plainPw, 10)
  }
  next()
})

UserSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()
  delete userObject.password
  delete userObject.__v
  return userObject
}

UserSchema.statics.checkCredentials = async function (email, plainPw) {
  const user = await this.findOne({ email })
  console.log("checking credentials...")
  if (user) {
    const hashedPw = user.password
    const isMatch = await bcrypt.compare(plainPw, hashedPw)

    if (isMatch) {
      return user
    } else {
      return null
    }
  } else {
    return null
  }
}

export default mongoose.model("User", UserSchema)
