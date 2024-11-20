import { catchAsynhErrors } from "../middlewares/catchAsynchErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";

export const patientRegister = catchAsynhErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
    role,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !gender ||
    !dob ||
    !nic ||
    !role
  ) {
    return next(new ErrorHandler("Please Fill All Fields!", 400));
  }
  const user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User already registered!", 400));
}
await User.create({
  firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
    role,
});
res.status(200).json({
  success: true,
  message: "Patient registered successfully",
})
});

export const login = catchAsynhErrors(async(req,res,next) => {
  const { email, password, confirmPassword, role } = req.body;
  if (!email ||!password || !confirmPassword || !role) {
    return next(new ErrorHandler("Please Provide All Details!", 400));
  }
  if(password !== confirmPassword){
    return next(new ErrorHandler("Password and confirm password do not match!", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Credentials!", 401));
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Credentials!", 401));
  }
  if(user.role!== role){
    return next(new ErrorHandler("User with this role not found!", 403));
  }
  res.status(200).json({
    success: true,
    message: "Login successful",
  })
})