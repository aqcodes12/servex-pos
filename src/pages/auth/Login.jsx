import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandLogo from "../../assets/favicon.png";
import { Eye, EyeOff, Layout } from "lucide-react";

const USERS = [
  {
    email: "admin@gmail.com",
    password: "abc123",
    role: "admin",
    name: "Admin User",
  },
  {
    email: "cashier@gmail.com",
    password: "abc123",
    role: "cashier",
    name: "Cashier One",
  },
];

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = USERS.find(
      (u) =>
        u.email === form.email.trim() && u.password === form.password.trim()
    );

    if (!user) {
      setError("Invalid email or password");
      return;
    }

    // Save to localStorage
    localStorage.setItem(
      "pos_user",
      JSON.stringify({
        name: user.name,
        role: user.role,
        email: user.email,
      })
    );

    setError("");

    // Role-based redirect
    if (user.role === "admin") {
      navigate("/pos");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side */}
      <div className="hidden md:flex md:w-1/2 bg-emerald-50 items-center justify-center">
        <div className="text-center p-8">
          <img src={BrandLogo} alt="Logo" className="h-28 w-28 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-primary">
            Welcome to Servex POS
          </h1>
          <p className="text-gray-600 mt-3 text-sm">
            Log in to manage your orders, inventory, and sales.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
          <div className="flex justify-center mb-6">
            <Layout className="text-primary" size={28} />
          </div>

          <h2 className="text-xl font-semibold text-center mb-6">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-primary"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-white py-2.5 rounded-lg font-medium"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
