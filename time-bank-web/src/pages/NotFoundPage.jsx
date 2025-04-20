import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="text-center py-20 space-y-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl">Page not found.</p>
      <Link
        to="/"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Go Home
      </Link>
    </div>
  );
}
