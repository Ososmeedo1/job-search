
import mongoose from "mongoose";


const {Schema, model} = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      minLength: 6
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true
    },
    recoveryEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    DOB: {
      type: String,
      required: true
    },
    status: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      enum: ["User", "Company_HR"],
      default: "User"
    },
    otp: {
      type: String
    }

  },
  {
    timestamps: true,
    versionKey: false
  }
)

const User = mongoose.models.User || model('User', userSchema);

export default User;