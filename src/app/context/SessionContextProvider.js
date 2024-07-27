"use client";
import React, { useReducer } from "react";
import Session from "./sessionContext";

export default function SessionContextProvider({ children }) {
  function reducer(state, action) {
    switch (action.type) {
      case "ACTIVE":
        window.localStorage.setItem("isSessionActive", JSON.stringify(true));
        return true;

      case "INACTIVE":
        window.localStorage.setItem("isSessionActive", JSON.stringify(false));
        return false;

      default:
        return state;
    }
  }

  const sessionDetails = JSON.parse(window.localStorage.getItem("isSessionActive")) || false;
  const [isActive, dispatch] = useReducer(reducer, sessionDetails);

  return <Session.Provider value={{ isActive, dispatch }}>{children}</Session.Provider>;
}
