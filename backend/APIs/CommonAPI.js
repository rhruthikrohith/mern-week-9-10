import exp from "express";
import { authenticate } from "../services/authService.js";
import { UserTypeModel } from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { verifyToken } from "../middlewares/verifyToken.js";

export const commonRouter = exp.Router();

//login
commonRouter.post("/login", async (req, res) => {
  let userCred = req.body;
  let { token, user } = await authenticate(userCred);

  // Keep cookie
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  // ✅ Also return token in response body
  res.status(200).json({ 
    message: "login success", 
    payload: { token, user }  // ← CHANGED (was just: payload: user)
  });
});

//logout for User, Author and Admin
commonRouter.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

//Change password (Protected route)
commonRouter.put("/change-password", async (req, res) => {
  const { role, email, currentPassword, newPassword } = req.body;

  if (currentPassword === newPassword) {
    return res.status(400).json({ message: "newPassword must be different from currentPassword" });
  }

  const account = await UserTypeModel.findOne({ email });
  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  const isMatch = await bcrypt.compare(currentPassword, account.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  account.password = await bcrypt.hash(newPassword, 10);
  await account.save();

  res.status(200).json({ message: "Password changed successfully" });
});

//Page refresh
commonRouter.get("/check-auth", verifyToken("USER", "AUTHOR", "ADMIN"), (req, res) => {
  res.status(200).json({
    message: "authenticated",
    payload: req.user,
  });
});
