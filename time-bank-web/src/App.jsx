import React from "react";
import "./index.css";
import NavBar from "./components/NavBar";
import Router from "./routes/Router";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans flex flex-col">

      
      {/* NAVIGATION BAR */}
      <header className="sticky top-0 z-30 shadow backdrop-blur bg-white/80">
        <NavBar />
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Router />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white text-sm text-center text-gray-500 border-t py-6">
        © {new Date().getFullYear()} <span className="font-semibold text-gray-700">TimeBank</span>. Built with care.
      </footer>
    </div>
  );
}
