"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import Session from "@/app/context/sessionContext";
const Logout = () => {
  const router = useRouter();
  const { isActive, dispatch } = useContext(Session);
  async function logOut() {
    dispatch({ type: "INACTIVE" });
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
