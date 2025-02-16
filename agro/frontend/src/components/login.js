import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(UserContext); // Get login function
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Login successful!");
        localStorage.setItem("token", data.token); // Store JWT Token
        login(data.user); // Update UserContext with user details
        navigate(data.user.role === "admin" ? "/admin" : "/");
      } else {
        alert("❌ Login failed: " + data.message);
      }
    } catch (error) {
      console.error("❌ Error during login:", error);
      alert("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-3xl font-semibold text-center mb-8">LOGIN</h1>
      <form className="bg-white p-6 shadow-md rounded-md" onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 w-full p-2 rounded"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 w-full p-2 rounded"
            required
          />
        </div>
        <div className="mb-6">
          <button type="submit" className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 w-full">
            Sign In
          </button>
        </div>
        <div className="flex justify-between">
          <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-black">
            Forgot password?
          </Link>
          <Link to="/signup" className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
