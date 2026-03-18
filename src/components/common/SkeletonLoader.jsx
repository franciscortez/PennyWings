import React from "react";

export default function SkeletonLoader({ className = "" }) {
  return (
    <div className={`animate-pulse bg-pink-100/50 rounded-2xl ${className}`} />
  );
}
