import React, { useState } from "react";
import { Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BrandLogo from "../../assets/daily.png";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy credentials
    if (form.email === "admin@gmail.com" && form.password === "abc123") {
      setError("");
      navigate("/"); // redirect to home
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-emerald-50 items-center justify-center">
        <div className="text-center p-8">
          <div className="flex items-center justify-center mb-6">
            {/* <span className="bg-emerald-100 text-primary p-3 rounded-2xl">
              <Coffee size={28} />
            </span> */}

            <img src={BrandLogo} alt="" className="h-28 w-28" />
          </div>
          <h1 className="text-3xl font-bold text-primary">
            Welcome to Daily Cup
          </h1>
          <p className="text-gray-600 mt-3 text-sm">
            Log in to manage your coffee shop dashboard.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <div className="flex items-center justify-center mb-6">
            <Coffee className="text-primary" size={28} />
          </div>

          <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
            Sign in to your account
          </h2>
          {/* <p className="text-center text-gray-500 text-sm mb-6">
            Use the demo credentials below
          </p> */}

          {/* Dummy credentials note */}
          {/* <div className="text-xs bg-gray-50 text-gray-600 p-2 rounded-lg mb-4 text-center border border-gray-100">
            <p>
              <strong>Email:</strong> admin@gmail.com
            </p>
            <p>
              <strong>Password:</strong> abc123
            </p>
          </div> */}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm font-medium">{error}</div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary transition"
            >
              Sign In
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-5">
            Don’t have an account?{" "}
            <a href="#" className="text-primary font-medium hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
