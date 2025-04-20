import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-4 mt-8">
      <div className="container mx-auto text-center text-sm">
        &copy; {new Date().getFullYear()} Time Bank. All rights reserved.
      </div>
    </footer>
  );
}
