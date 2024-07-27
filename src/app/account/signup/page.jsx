import LoginForm from "@/components/forms/LoginForm";
import SignupForm from "@/components/forms/SignupForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
export const metadata = {
  title: "sign up",
  description: "AutionPe",
};
const page = () => {
  return (
    <main className='p-24 flex flex-col items-center gap-2'>
      <h1 className='text-3xl'>Create an account</h1>
      <SignupForm />
      <span>already have an account? </span>
      <Button variant='outline'>
        <Link href='/account/login'>Login</Link>
      </Button>
    </main>
  );
};

export default page;
