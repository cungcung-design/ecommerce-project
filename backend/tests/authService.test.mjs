import { describe, it, expect, vi } from "vitest";
import bcrypt from "bcrypt";

vi.mock("../src/lib/prisma.js", () => {
  const calls = [];
  const state = {};

  const model = (name) => ({
    findUnique: vi.fn(async (...args) => {
      calls.push({ model: `${name}.findUnique`, args });
      const handler = state[`${name}.findUnique`];
      return handler ? handler(...args) : null;
    }),
    create: vi.fn(async (args) => {
      calls.push({ model: `${name}.create`, args });
      const handler = state[`${name}.create`];
      return handler ? handler(args) : { id: 1, ...args.data };
    }),
  });

  const prisma = {
    user: model("user"),
    refreshToken: model("refreshToken"),
  };

  return { default: prisma, prisma };
});

vi.mock("../src/lib/tokenLib.js", () => ({
  generateTokens: vi.fn(async () => ({
    accessToken: "access",
    refreshToken: "refresh",
  })),
}));

import * as authService from "../src/services/authService.js";

describe("Auth Service", () => {
  it("registerUser: creates user with hashed password", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: 1,
      name: "Test",
      email: "test@example.com",
      role: "CUSTOMER",
    });

    const result = await authService.registerUser({
      name: "Test",
      email: "test@example.com",
      password: "password123",
    });

    expect(result.user.email).toBe("test@example.com");
    expect(result.accessToken).toBe("access");
    expect(result.refreshToken).toBe("refresh");
    expect(prisma.user.create.mock.calls[0][0].data.password).not.toBe("password123");
    expect(prisma.user.create.mock.calls[0][0].data.password.startsWith("$2b$")).toBe(true);
  });

  it("registerUser: rejects duplicate email", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: "test@example.com" });

    await expect(
      authService.registerUser({
        name: "Test",
        email: "test@example.com",
        password: "password123",
      })
    ).rejects.toThrow("Email is already registered");
  });

  it("loginUser: returns tokens for valid credentials", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    const hashedPassword = await bcrypt.hash("password123", 12);
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: "test@example.com",
      password: hashedPassword,
      isActive: true,
      role: "CUSTOMER",
    });

    const result = await authService.loginUser({
      email: "test@example.com",
      password: "password123",
    });

    expect(result.user.email).toBe("test@example.com");
    expect(result.accessToken).toBe("access");
  });

  it("loginUser: rejects unknown user", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      authService.loginUser({
        email: "missing@example.com",
        password: "password123",
      })
    ).rejects.toThrow("Invalid email or password");
  });

  it("loginUser: rejects inactive account", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: "test@example.com",
      password: "hash",
      isActive: false,
      role: "CUSTOMER",
    });

    await expect(
      authService.loginUser({
        email: "test@example.com",
        password: "password123",
      })
    ).rejects.toThrow("Your account is inactive");
  });

  it("loginUser: rejects wrong password", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: "test@example.com",
      password: await bcrypt.hash("password123", 12),
      isActive: true,
      role: "CUSTOMER",
    });

    await expect(
      authService.loginUser({
        email: "test@example.com",
        password: "wrong",
      })
    ).rejects.toThrow("Invalid email or password");
  });
});
