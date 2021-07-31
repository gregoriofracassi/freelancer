import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		required: true,
		enum: ["Admin", "User"],
		default: "User",
	},
	avatar: {
		type: String,
		required: true,
		default: "https://image.flaticon.com/icons/png/512/5173/5173555.png",
	},
});

UserSchema.pre('save', async function (next) {
  const newUser = this;
  const plainPw = newUser.password;

  if (newUser.isModified('password')) {
    newUser.password = await bcrypt.hash(plainPw, 10);
  }
  next();
});

UserSchema.methods.toJSON = function () {
  // toJSON is a method called every time express does a res.send

  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

UserSchema.statics.checkCredentials = async function (email, plainPw) {
  const user = await this.findOne({ email });
  console.log(user);
  console.log('checking credentials...');
  if (user) {
    // 2. compare plainPw with hashed pw
    const hashedPw = user.password;
    console.log(hashedPw);
    const isMatch = await bcrypt.compare(plainPw, hashedPw);
    console.log(isMatch);

    // 3. return a meaningful response
    if (isMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export default mongoose.model('User', UserSchema);
