import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { PrismaClient } from "@prisma/client";
const SECRET_KEY = process.env.SECRET_KEY || "secret";
const prisma = new PrismaClient();
export async function GET(req) {
  const token = req.cookies.get("auth_token");
  let decoded = null;
  try {
    decoded = await jose.jwtVerify(token.value, new TextEncoder().encode(SECRET_KEY));
  } catch (error) {
    return NextResponse.redirect(new URL("/account/login", req.url));
  }
  let sdecoded = {
    payload: {
      userId: 1,
      username: "yesrab",
      sessionId: 17,
      expirationTime: 1722103029,
      iat: 1722102730,
      exp: 1722103030,
    },
    protectedHeader: {
      alg: "HS256",
      typ: "JWT",
    },
  };

  let data = await prisma.sessionHistory.findUnique({
    where: { userId: decoded.payload.userId, id: decoded.payload.sessionId },
  });

  return NextResponse.json({
    message: "current session data",
    sessionData: data,
  });
}
