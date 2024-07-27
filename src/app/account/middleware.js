import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
const SECRET_KEY = process.env.SECRET_KEY || "secret";

export async function middleware(req) {
  const token = req.cookies.get("auth_token");
  console.log("account middleware");
  if (token?.value) {
    console.log("redirecting to Login");
    return NextResponse.redirect(new URL("/", req.url));
  }
  try {
    const decoded = await jose.jwtVerify(token.value, new TextEncoder().encode(SECRET_KEY));
    return NextResponse.redirect(new URL("/", req.url));
  } catch (error) {
    // console.log("errored out");
    // console.log(error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/account/login"],
};
