import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../lib/prisma.js";

const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  );

  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashToken(refreshToken);

  await prisma.refreshToken.create({
    data: {
      tokenHash: refreshTokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const verifyRefreshToken = async (token) => {
  const tokenHash = hashToken(token);

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: true,
    },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    return null;
  }

  return storedToken;
};

export const revokeRefreshToken = async (token) => {
  const tokenHash = hashToken(token);

  await prisma.refreshToken.deleteMany({
    where: {
      tokenHash,
    },
  });
};

export const revokeAllUserTokens = async (userId) => {
  await prisma.refreshToken.deleteMany({
    where: {
      userId,
    },
  });
};
