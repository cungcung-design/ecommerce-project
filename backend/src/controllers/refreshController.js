import jwt from "jsonwebtoken";
import { verifyRefreshToken, generateTokens, revokeRefreshToken } from "../lib/tokenLib.js";

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const storedToken = await verifyRefreshToken(refreshToken);

    if (!storedToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    const user = storedToken.user;

    const tokens = await generateTokens(user);

    await revokeRefreshToken(refreshToken);

    res.json({
      success: true,
      ...tokens,
    });
  } catch (error) {
    console.error("REFRESH TOKEN ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to refresh token",
    });
  }
};
