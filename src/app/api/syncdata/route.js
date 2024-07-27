import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { PrismaClient } from "@prisma/client";
const SECRET_KEY = process.env.SECRET_KEY || "secret";
const prisma = new PrismaClient();

export async function GET(req) {
  const token = req.cookies.get("auth_token");
  if (!token) {
    return NextResponse.redirect(new URL("/account/login", req.url));
  }
  let decoded;
  try {
    decoded = await jose.jwtVerify(token.value, new TextEncoder().encode(SECRET_KEY));
  } catch (error) {
    return NextResponse.redirect(new URL("/account/login", req.url));
  }

  const sessionData = await prisma.sessionHistory.findUnique({
    where: { userId: decoded.payload.userId, id: decoded.payload.sessionId },
  });

  if (!sessionData) {
    return NextResponse.json({ message: "Session not found" }, { status: 404 });
  }
  return NextResponse.json({
    message: "Current session data",
    sessionData,
  });
}

export async function PATCH(req) {
  const token = req.cookies.get("auth_token");
  if (!token) {
    return NextResponse.redirect(new URL("/account/login", req.url));
  }

  let decoded;
  try {
    decoded = await jose.jwtVerify(token.value, new TextEncoder().encode(SECRET_KEY));
  } catch (error) {
    return NextResponse.redirect(new URL("/account/login", req.url));
  }

  const data = await req.json();
  const { counter, toggle } = data;

  if (typeof counter !== "number" || typeof toggle !== "boolean") {
    return NextResponse.json({ message: "Invalid data format" }, { status: 400 });
  }

  try {
    const sessionData = await prisma.sessionHistory.update({
      where: { id: decoded.payload.sessionId },
      data: {
        counter,
        toggle,
      },
    });

    return NextResponse.json({
      decoded,
      sessionData,
    });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
