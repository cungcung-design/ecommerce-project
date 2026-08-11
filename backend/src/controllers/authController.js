import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { generateTokens, revokeAllUserTokens } from "../lib/tokenLib.js";
import { registerUser, loginUser } from "../services/authService.js";

export const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const accessToken = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        await revokeAllUserTokens(decoded.id);
      } catch {
        // Token invalid, still proceed with logout
      }
    }

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};
