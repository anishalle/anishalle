"use client";

import "./app.css";
import "@appwrite.io/pink-icons";
import { useState, useEffect, useRef, useCallback } from "react";
import { client, account, databases} from "@/lib/appwrite";
import { AppwriteException } from "appwrite";
import NextjsLogo from "../static/nextjs-icon.svg";
import AppwriteLogo from "../static/appwrite-icon.svg";
import Image from "next/image";

export default function Home() {
  const [detailHeight, setDetailHeight] = useState(55);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("idle");
  const [showLogs, setShowLogs] = useState(false);

  const detailsRef = useRef(null);

  const updateHeight = useCallback(() => {
    if (detailsRef.current) {
      setDetailHeight(detailsRef.current.clientHeight);
    }
  }, [logs, showLogs]);

  useEffect(() => {
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [updateHeight]);

  useEffect(() => {
    if (!detailsRef.current) return;
    detailsRef.current.addEventListener("toggle", updateHeight);

    return () => {
      if (!detailsRef.current) return;
      detailsRef.current.removeEventListener("toggle", updateHeight);
    };
  }, []);

  async function sendPing() {
    if (status === "loading") return;
    setStatus("loading");
    try {
      const result = await client.ping();
      const log = {
        date: new Date(),
        method: "GET",
        path: "/v1/ping",
        status: 200,
        response: JSON.stringify(result),
      };
      setLogs((prevLogs) => [log, ...prevLogs]);
      setStatus("success");
    } catch (err) {
      const log = {
        date: new Date(),
        method: "GET",
        path: "/v1/ping",
        status: err instanceof AppwriteException ? err.code : 500,
        response:
          err instanceof AppwriteException
            ? err.message
            : "Something went wrong",
      };
      setLogs((prevLogs) => [log, ...prevLogs]);
      setStatus("error");
    }
    setShowLogs(true);
  }

  return (<>
  <h1> Hi hasini </h1>
  <Image src={"/hasini.jpeg"} width={500} height={500} alt="a pic of a bozo"/>
  </> );
}
