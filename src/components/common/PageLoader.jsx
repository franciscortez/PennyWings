import React from "react";
import Icon from "../Icon";

export default function PageLoader() {
  return (
    <div className="min-h-screen bg-pink-50 dark:bg-dark-bg transition-colors duration-300 flex flex-col items-center justify-center p-4">
      <svg
        className="w-24 h-24 text-pink-500 dark:text-pink-400 animate-bounce mb-6"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 48 20 C 40 10 30 15 35 20"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path 
          d="M 52 20 C 60 10 70 15 65 20"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 48 30 C 20 -5 0 20 15 45 C 0 65 20 95 48 65 Z"
          fill="currentColor"
          fillOpacity="0.4"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M 52 30 C 80 -5 100 20 85 45 C 100 65 80 95 52 65 Z"
          fill="currentColor"
          fillOpacity="0.4"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="25" cy="30" r="3" fill="currentColor" fillOpacity="0.2" />
        <circle cx="75" cy="30" r="3" fill="currentColor" fillOpacity="0.2" />
        <rect x="47" y="20" width="6" height="45" rx="3" fill="currentColor" />
        <circle cx="50" cy="18" r="4" fill="currentColor" />
      </svg>
      <div className="flex gap-2 items-center">
        <div
          className="w-3 h-3 bg-pink-400 dark:bg-pink-300 rounded-full animate-pulse"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-3 h-3 bg-pink-500 dark:bg-pink-400 rounded-full animate-pulse"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-3 h-3 bg-pink-600 dark:bg-pink-500 rounded-full animate-pulse"
          style={{ animationDelay: "300ms" }}
        />{" "}
      </div>
    </div>
  );
}
