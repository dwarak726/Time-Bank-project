import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";  // Assuming you have api setup

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");  // State to store error messages
  const [isSignup, setIsSignup] = useState(false);  // State to toggle between login and signup forms
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (email && password) {
      try {
        const response = await api.post("auth/login/", { email, password });

        if (response.data && response.data.token) {
          const user = {
            name: response.data.user.name,
            email: response.data.user.email,
            time_tokens: response.data.user.time_tokens,
            token: response.data.token,
          };

          login(user);
          navigate("/hub");
        }
      } catch (error) {
        setError("Invalid credentials, please try again.");
      }
    } else {
      setError("Please enter valid credentials.");
    }
  };

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();

    if (email && password) {
      try {
        const response = await api.post("auth/signup/", { email, password });

        if (response.data && response.data.token) {
          const user = {
            name: response.data.user.name,
            email: response.data.user.email,
            time_tokens: response.data.user.time_tokens,
            token: response.data.token,
          };

          login(user);
          navigate("/hub");
        }
      } catch (error) {
        setError("Error creating account, please try again.");
      }
    } else {
      setError("Please enter valid credentials.");
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">{isSignup ? "Create New Account" : "Login"}</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={isSignup ? handleSignup : handleLogin}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold">Email</label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-semibold">Password</label>
          <input
            type="password"
            id="password"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isSignup ? "Create Account" : "Login"}
        </button>
      </form>

      <div className="text-center mt-4">
        <p>
          {isSignup
            ? "Already have an account? "
            : "Don’t have an account? "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login here" : "Sign up here"}
          </span>
        </p>
      </div>
    </div>
  );
}
