/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */
import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { env } from "~/env";

const AISDataDisplay = () => {
  const [aisData, setAisData] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("Connecting");

  const { lastMessage, readyState } = useWebSocket(`${env.NEXT_PUBLIC_WS}`);

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        // Attempt to parse as JSON
        const newData = JSON.parse(lastMessage.data);
        // @ts-expect-error trust me
        setAisData((prevData) => [...prevData, newData].slice(-10)); // Keep last 10 messages
      } catch (error) {
        // If parsing fails, treat the data as a string

        // @ts-expect-error trust me
        setAisData((prevData) => [...prevData, lastMessage.data].slice(-10));
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    switch (readyState) {
      case ReadyState.CONNECTING:
        setConnectionStatus("Connecting");
        break;
      case ReadyState.OPEN:
        setConnectionStatus("Connected");
        break;
      case ReadyState.CLOSING:
        setConnectionStatus("Closing");
        break;
      case ReadyState.CLOSED:
        setConnectionStatus("Closed");
        break;
      default:
        setConnectionStatus("Unknown");
        break;
    }
  }, [readyState]);

  return (
    <div className="m-2 h-64 w-full overflow-x-auto overflow-y-auto border border-gray-500 p-4">
      <h2 className="mb-4 text-2xl font-bold">AIS Data Display</h2>
      <p className="mb-2">Connection Status: {connectionStatus}</p>
      <ul className="space-y-2">
        {aisData.map((data, index) => (
          <li key={index} className="rounded border p-2">
            {index} : {typeof data === "object" ? JSON.stringify(data) : data}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AISDataDisplay;
