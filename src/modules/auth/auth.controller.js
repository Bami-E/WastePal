import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import * as authService from "../auth/auth.services.js";


export const register = asyncHandler(async (req, res) => {
  const user = await authService.register (req.body);
  return sendSuccess(res, 201, "User created successfully", { user });
});


export const verifyEmail = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.body);
  return sendSuccess(res, 200, "Email verified successfully", null);
});


export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return sendSuccess(res, 200, "User signed in successfully", result);
});



export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body);
  return sendSuccess(res, 200, "Password reset link sent successfully", result);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword({token: req.params.token, ...req.body,});
  return sendSuccess(res, 200, "Password reset successfully", result);
});






