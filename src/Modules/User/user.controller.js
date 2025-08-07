import User from "../../../DB/Models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ErrorHandlerClass } from "../../Utils/error-class.utils.js";
import { nanoid } from "nanoid";
import { sendEmailService } from "../../Services/sendEmail.service.js";

export const register = async (req, res, next) => {
  const { firstName, lastName, email, recoveryEmail, password, DOB, phone, role } = req.body;

  // Check User's data uniqness

  const userExists = await User.findOne({ $or: [{ email }, { phone }] });

  if (userExists) {
    return next(new ErrorHandlerClass("User Already Exists", 409));
  }

  const hashedPassword = bcrypt.hashSync(password, +(process.env.SALT_NUMBER));

  const userName = firstName + " " + lastName;

  const userData = {
    firstName,
    lastName,
    email,
    recoveryEmail,
    password: hashedPassword,
    DOB,
    phone,
    role,
    userName
  }

  const newUser = await User.create(userData);

  delete userData.password;

  return res.status(201).json({ message: "user added", user: userData })
}

export const login = async (req, res, next) => {
  const { email, password, phone } = req.body;

  const userExists = await User.findOne({ $or: [{ email }, { phone }] });

  if (!userExists) {
    return next(new ErrorHandlerClass("Invalid Credentials", 404))
  }

  const checkPassword = bcrypt.compareSync(password, userExists.password);

  if (!checkPassword) {
    return next(new ErrorHandlerClass("Invalid Credentials", 400))
  }

  const token = jwt.sign({ id: userExists._id }, process.env.TOKEN_SIGNATURE)
  const updateUserStatus = await User.updateOne({ _id: userExists._id }, { status: true });
  return res.status(200).json({ message: "Logged in Successfully", token });
}

export const updateUser = async (req, res, next) => {
  const { firstName, lastName, email, phone, recoveryEmail, DOB } = req.body;
  let userName;
  const user = req.user;

  const isExist = await User.findOne({ $or: [{ email }, { phone }] });

  if (isExist) {
    return next(new ErrorHandlerClass('Duplicated data', 400))
  }

  if (firstName && lastName) {
    userName = firstName + " " + lastName;
  } else if (firstName) {
    userName = firstName + " " + user.lastName;
  } else if (lastName) {
    userName = user.firstName + " " + lastName;
  }

  const updatedUserData = {
    firstName: firstName ? firstName : user.firstName,
    lastName: lastName ? lastName : user.lastName,
    email: email ? email : user.email,
    phone: phone ? phone : user.phone,
    recoveryEmail: recoveryEmail ? recoveryEmail : user.recoveryEmail,
    DOB: DOB ? DOB : user.DOB,
    userName: userName ? userName : user.userName
  }


  const updatedUser = await User.updateOne({ _id: user._id }, updatedUserData);

  return res.status(200).json({ message: "Done", data: updatedUserData });


}

export const deleteUser = async (req, res, next) => {
  const { user } = req;
  const deleteUser = await User.deleteOne({ _id: user._id });

  if (!deleteUser.deletedCount) {
    return next(new ErrorHandlerClass("Account not deleted", 404, "Delete user", deleteUser))
  }

  return res.status(200).json({ message: "Done" })

}

export const profileData = async (req, res, next) => {
  const { user } = req;

  return res.status(200).json({ message: "Done", data: user })
}

export const getSpecificUser = async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findOne({ _id: userId }).select('-password -phone');

  if (!user) {
    return next(new ErrorHandlerClass("User not found", 404));
  }

  return res.status(200).json({ message: "Done", data: user });
}

export const getRecoveryEmails = async (req, res, next) => {
  const { recoveryEmail } = req.body;
  const users = await User.find({ recoveryEmail }).select('-password -phone');

  if (users.length == 0) {
    return next(new ErrorHandlerClass("No users found", 404))
  }

  return res.status(200).json({ message: "Done", data: users });
}

export const updatePassword = async (req, res, next) => {
  const { user } = req;
  let { oldPassword, newPassword } = req.body;


  const userPassword = await User.findById({ _id: user._id });


  if (!userPassword) {
    return next(new ErrorHandlerClass("User was not found", 404));
  }

  const checkPassword = bcrypt.compareSync(oldPassword, userPassword.password);


  if (!checkPassword) {
    return next(new ErrorHandlerClass("Invalid Password", 400))
  }

  newPassword = bcrypt.hashSync(newPassword, +(process.env.SALT_NUMBER))

  const updatePassword = await User.updateOne({ _id: user._id }, { password: newPassword });

  return res.status(200).json({ message: "Password updated" })

}

export const forgotPassword = async (req, res, next) => {
  const { user } = req;
  const { email } = req.body;
  const otp = nanoid(6);

  const emailForOtp = await sendEmailService({
    to: email,
    subject: "Reset Your Password",
    message: otp
  })

  if (emailForOtp.rejected.length) {
    return next(new ErrorHandlerClass("Otp email has not been sent", 500))
  }

  const addOtp = await User.updateOne({ _id: user._id }, { otp });

  return res.status(201).json({ message: `Otp has been sent on your email : ${email}` })

}

export const checkOtp = async (req, res, next) => {
  const { otp } = req.body;
  const { user } = req;

  if (!(otp == user.otp)) {
    return next(new ErrorHandlerClass("Invalid Otp", 404));
  }

  return res.status(200).json({ message: "done" });

}

export const resetPassword = async (req, res, next) => {
  const { newPassword, confirmPassword } = req.body;
  const { user } = req;
  const otp = nanoid(6);
  const hashedPassword = bcrypt.hashSync(newPassword, +(process.env.SALT_NUMBER));

  const updatePassword = await User.updateOne({_id: user._id}, {password: hashedPassword, otp});

  return res.status(200).json({message: "Password has been changed"})
}

export const getRecoveryEmailAccounts = async (req, res, next) => {
  const {recoveryEmail} = req.body;

  const findAccounts = await User.find({recoveryEmail}).select('-password');

  if (!findAccounts.length) {
    return next(new ErrorHandlerClass("No accounts associated to this recovery email", 404))
  }

  return res.status(200).json({message: "done", data: findAccounts})
}