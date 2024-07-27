"use client";
import { useEffect, useState, useContext } from "react";
import Session from "@/app/context/sessionContext";
const CountdownTimer = ({ expirationTime }) => {
  const [timeLeft, setTimeLeft] = useState(expirationTime - Math.floor(Date.now() / 1000));
  const { isActive, dispatch } = useContext(Session);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(expirationTime - Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [expirationTime]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (timeLeft <= 0) {
    dispatch({ type: "INACTIVE" });
    return <div className='text-red-600'>Session expired !</div>;
  }

  return <div>Time left: {formatTime(timeLeft)}</div>;
};

export default CountdownTimer;
