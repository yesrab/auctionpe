import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "secret";
const prisma = new PrismaClient();

export async function GET() {
  return NextResponse.json({
    message: "hello from login server",
  });
}

export async function POST(req) {
  const data = await req.json();
  const { username, password } = data;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const sessionTime = 300; // Session time in seconds
    const expirationTime = Math.floor(Date.now() / 1000) + sessionTime;

    // Create a new session history entry
    await prisma.sessionHistory.create({
      data: {
        counter: 0,
        toggle: false,
        expirationTime: new Date(expirationTime * 1000), // Convert to Date object
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

    const response = NextResponse.json({ user, message: "Login successful" }, { status: 201 });
    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (error) {
    console.error(error.message);
    return NextResponse.json({ error: "Login failed", message: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  cookies().delete("auth_token");
  return NextResponse.redirect(new URL("/", req.url));
}
