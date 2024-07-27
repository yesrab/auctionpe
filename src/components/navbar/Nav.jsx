import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import * as jose from "jose";
import Logout from "./Logout";
const SECRET_KEY = process.env.SECRET_KEY || "secret";
const Nav = async () => {
  const cookieStore = cookies();
  const user = cookieStore.get("auth_token");
  let data = null;
  try {
    data = await jose.jwtVerify(user.value, new TextEncoder().encode(SECRET_KEY));
    console.log(data.payload);
  } catch (e) {
    console.error("error", e);
  }

  return (
    <nav className='flex gap-4'>
      <Link href='/DashBoard'>
        <Button variant='outline'>DashBoard</Button>
      </Link>
      {!data?.payload ? (
        <Link href='/account/login'>
          <Button variant='outline'>Login</Button>
        </Link>
      ) : (
        <Logout />
      )}
    </nav>
  );
};

export default Nav;
