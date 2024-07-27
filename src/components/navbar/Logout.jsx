"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const Logout = () => {
  const router = useRouter();
  async function logOut() {
    const responce = await fetch("/api/account/login", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: "",
    });
    window.location.href = "/";
  }
  return (
    <Button onClick={logOut} variant='destructive'>
      Sign Out
    </Button>
  );
};

export default Logout;
