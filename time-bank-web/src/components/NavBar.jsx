import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  const base = "text-gray-700 hover:text-gray-900 transition";
  const active = "text-primary font-semibold";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-bold text-gray-900">
          TimeBank
        </NavLink>

        {/* Nav Links */}
        <div className="space-x-4 text-sm">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${base} ${isActive ? active : ""}`}
          >
            Home
          </NavLink>

          {!user && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => `${base} ${isActive ? active : ""}`}
              >
                Login
              </NavLink>
              {/* Update Register to link to Profile Page */}
              <NavLink
                to="/profile"
                className={({ isActive }) => `${base} ${isActive ? active : ""}`}
              >
                Profile
              </NavLink>
            </>
          )}

          {user && (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `${base} ${isActive ? active : ""}`}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/tasks"
                className={({ isActive }) => `${base} ${isActive ? active : ""}`}
              >
                All Tasks
              </NavLink>
              <NavLink
                to="/tasks/new"
                className={({ isActive }) => `${base} ${isActive ? active : ""}`}
              >
                New Task
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) => `${base} ${isActive ? active : ""}`}
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="ml-4 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
