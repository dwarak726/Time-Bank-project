import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { login as apiLogin, signup as apiSignup } from "../services/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async e => {
    e.preventDefault();
    setError("");
    try {
      const data = await apiLogin({ email, password });
      // store in context (and localStorage via AuthContext)
      login({ user: data.user, token: data.access });
      navigate("/hub");
    } catch {
      setError("Invalid credentials");
    }
  };

  const handleSignup = async e => {
    e.preventDefault();
    setError("");
    try {
      const data = await apiSignup({ username, email, password });
      login({ user: data.user, token: data.access });
      navigate("/hub");
    } catch (err){
      console.error("Signup error response:", err.response.data);
      setError("Signup failed"+Object.entries(err.response.data)
                .map(([field, msgs])=> `${field}: ${msgs.join(" ")}`)
                .join(" | "));
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {isSignup ? "Create New Account" : "Login"}
      </h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={isSignup ? handleSignup : handleLogin}>
        {isSignup && (
          <div className="mb-4">
            <label>Username</label>
            <input
              className="w-full p-2 border rounded"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
        )}
        <div className="mb-4">
          <label>Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label>Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>
      </form>

      <p className="mt-4 text-center">
        {isSignup ? "Already have an account?" : "No account yet?"}{" "}
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => {
            setError("");
            setIsSignup(!isSignup);
          }}
        >
          {isSignup ? "Login" : "Sign up"}
        </span>
      </p>
    </div>
  );
}
