import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
const SECRET_KEY = process.env.SECRET_KEY || "secret";

export async function middleware(req) {
  const { name, value } = req.cookies.get("auth_token");

  if (!value) {
    console.log("redirecting to Login");
    return NextResponse.redirect(new URL("/account/login", req.url));
  }
  try {
    const decoded = await jose.jwtVerify(value, new TextEncoder().encode(SECRET_KEY));
    return NextResponse.next();
  } catch (error) {
    console.log("errored out");
    console.log(error);
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/DashBoard"],
};
