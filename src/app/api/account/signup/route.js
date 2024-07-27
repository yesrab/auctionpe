import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "secret";
const prisma = new PrismaClient();

export async function GET() {
  return NextResponse.json({
    message: "hello from signup server",
  });
}

export async function POST(req) {
  const data = await req.json();
  const { username, password } = data;

  try {
    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        password,
      },
    });

    const sessionTime = 300;
    const expirationTime = Math.floor(Date.now() / 1000) + sessionTime;

    // Create session history entry
    const sessionHistory = await prisma.sessionHistory.create({
      data: {
        counter: 0,
        toggle: false,
        expirationTime: new Date(expirationTime * 1000),
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, expirationTime },
      SECRET_KEY,
      {
        expiresIn: sessionTime,
      },
    );

    const cookie = serialize("auth_token", token, {
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTime,
      path: "/",
    });

    const response = NextResponse.json({ user, message: "Signup successful" }, { status: 201 });
    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (error) {
    console.error(error.message);
    if (error.message.includes("Unique") && error.message.includes("(`username`)")) {
      return NextResponse.json(
        { error: "Failed to create account", message: "This user already exists" },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create account", message: error.message },
      { status: 500 },
    );
  }
}
