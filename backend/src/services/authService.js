import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import prisma from "../lib/prisma.js";
import { generateTokens } from "../lib/tokenLib.js";

const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const issueSession = async (user) => {
  const tokens = await generateTokens(user);

  return {
    user: toPublicUser(user),
    ...tokens,
  };
};

const assertActive = (user) => {
  if (!user.isActive) {
    const error = new Error("Your account is inactive");
    error.statusCode = 403;
    throw error;
  }
};

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  const tokens = await generateTokens(user);

  return {
    user,
    ...tokens,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error("Your account is inactive");
    error.statusCode = 403;
    throw error;
  }

  if (!user.password) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return issueSession(user);
};

const getGoogleClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    const error = new Error("Google sign-in is not configured");
    error.statusCode = 500;
    throw error;
  }

  return new OAuth2Client(clientId, clientSecret, "postmessage");
};

export const loginWithGoogle = async (code) => {
  const client = getGoogleClient();
  let idToken;

  try {
    const { tokens } = await client.getToken(code);
    idToken = tokens.id_token;
  } catch {
    const error = new Error("Google sign-in failed. Please try again.");
    error.statusCode = 401;
    throw error;
  }

  if (!idToken) {
    const error = new Error("Google sign-in failed. Please try again.");
    error.statusCode = 401;
    throw error;
  }

  let payload;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    const error = new Error("Google sign-in failed. Please try again.");
    error.statusCode = 401;
    throw error;
  }

  const googleId = payload?.sub;
  const email = payload?.email?.toLowerCase();

  if (!googleId || !email || payload.email_verified !== true) {
    const error = new Error("Google account email is not verified");
    error.statusCode = 401;
    throw error;
  }

  const name = payload.name?.trim() || email.split("@")[0];

  const existingByGoogle = await prisma.user.findUnique({
    where: { googleId },
  });

  if (existingByGoogle) {
    assertActive(existingByGoogle);
    return issueSession(existingByGoogle);
  }

  const existingByEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingByEmail) {
    assertActive(existingByEmail);

    if (existingByEmail.googleId && existingByEmail.googleId !== googleId) {
      const error = new Error("This email is already linked to another Google account");
      error.statusCode = 409;
      throw error;
    }

    const linkedUser = existingByEmail.googleId
      ? existingByEmail
      : await prisma.user.update({
          where: { id: existingByEmail.id },
          data: { googleId },
        });

    return issueSession(linkedUser);
  }

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        googleId,
        role: "CUSTOMER",
      },
    });

    return issueSession(user);
  } catch (error) {
    if (error.code !== "P2002") {
      throw error;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      throw error;
    }

    assertActive(existingUser);

    if (existingUser.googleId && existingUser.googleId !== googleId) {
      const duplicateError = new Error("This email is already linked to another Google account");
      duplicateError.statusCode = 409;
      throw duplicateError;
    }

    const linkedUser = existingUser.googleId
      ? existingUser
      : await prisma.user.update({
          where: { id: existingUser.id },
          data: { googleId },
        });

    return issueSession(linkedUser);
  }
};
