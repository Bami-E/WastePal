import bcrypt from "bcrypt";
import crypto from "crypto"
import jwt from "jsonwebtoken"
import { User } from "../../Database/entities/user.entities.js"
import { AppDataSource } from "../../config/db.js"
import { AppError } from "../../utils/AppError.js";
import  { newId } from '../../utils/id.js';
import { AuthProvider } from "../../types/authprovider.js";
import { sendTemplateEmail } from "../../utils/email.utils.js";
import { generateResetToken } from "../../utils/resetPassword.js";



const userRepo = AppDataSource.getRepository("User")

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();


const SALT_ROUNDS = 10;

export function issueTokens(user) {
  const payload = { sub: user.id, role: user.role, email: user.email };
  const accessToken = jwt.sign(payload,  process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN });
  const refreshToken = jwt.sign({ sub: user.id, type: 'refresh' },  process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
}



export const register = async ({ firstName, lastName, email, password, phoneNumber, role }) => {
  const existingUser = await userRepo.findOne({ where: { email } });

  if (existingUser) {
    throw new AppError("User already exists", 409, "DUPLICATE_USER");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const otp = generateOtp();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

   const user = await userRepo.save(
    userRepo.create({
      id : newId(),
      email,
      phoneNumber,
      password: hashedPassword,
      otp,
      otpExpiry,
      firstName,
      lastName,
      role,
      authProvider: AuthProvider.LOCAL,
    }),
  );
  


  sendTemplateEmail(email, "Email Verification", "signup", {
    firstName,
    lastName,
    otp,
  });

  const tokens = issueTokens(user);
  return { user: sanitizeUser(user), ...tokens };
};



//email verification

export const verifyEmail = async ({ otp }) => {
  const user = await userRepo.findOne({where: { otp },});
  if (!user) {
    throw new AppError("Invalid OTP", 400, "INVALID_OTP");
  }

  if (user.otpExpiry < new Date()) {
    throw new AppError("OTP has expired", 400, "OTP_EXPIRED");
  }

  await userRepo.update({ id: user.id },{isVerified: true,otp: null,otpExpiry: null,});

  sendTemplateEmail(user.email,"Email Verified Successfully","verify-email",{
      firstName: user.firstName
    }
  );

  return {
    message: "Email verified successfully",
  };
};


//endpoint for login
export const login = async ({ email, password }) => {
  const user = await userRepo
  .createQueryBuilder("user")
  .where("user.email = :email", { email })
  .getOne();

  if (!user) {
     throw new AppError("Invalid email or password", 400, "INVALID_CREDENTIALS");
  }

 if (user.authProvider === AuthProvider.GOOGLE) {
    throw new AppError("Please sign in with Google", 400, "USE_GOOGLE_SIGNIN");
  }

  if (!user.password) {
    throw new AppError("Invalid email or password", 400, "INVALID_CREDENTIALS");
  }

  if (!user.isVerified) {
    throw new AppError("Please verify your email before signing in", 400, "EMAIL_NOT_VERIFIED",);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 400, "INVALID_CREDENTIALS");
  }

  const tokens = issueTokens(user);

  return {user: sanitizeUser(user),...tokens,};
};




export const forgotPassword = async ({ email }) => {
  const user = await userRepo.findOne({
    where: { email },
  });

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  const { resetToken, hashedToken } = generateResetToken();

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);

  await userRepo.save(user);

  const resetUrl = `http://localhost:5000/api/v1/auth/reset-password/${resetToken}`;

  sendTemplateEmail(user.email, "Reset Password", "forgotPassword",{
    firstName
  });

  return {
    message: "Password reset link sent successfully",
  };
};



export const resetPassword = async ({ token, password }) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await userRepo.findOne({
    where: {
      resetPasswordToken: hashedToken,
    },
  });

  if (!user) {
    throw new AppError("Invalid reset token", 400, "INVALID_TOKEN");
  }

  if (user.resetPasswordExpires < new Date()) {
    throw new AppError("Reset token has expired", 400, "TOKEN_EXPIRED");
  }

  user.password = await bcrypt.hash(password, SALT_ROUNDS);

  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  await userRepo.save(user);

  sendTemplateEmail(user.email, "Password reset successufully", "password reset",{
    firstName
  });

  return {
    message: "Password reset successfully",
  };
};


export const sanitizeUser = (user) => {
  const { password, otp, verificationToken, ...safeUser } = user;
  return safeUser;
};