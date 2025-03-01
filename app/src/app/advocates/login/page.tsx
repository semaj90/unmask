"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { isAxiosError } from "axios";
import { User, Lock } from "lucide-react"; // Icons for input fields
import toast from "react-hot-toast";

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [lawyer, setLawyer] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("email", formData.email);
      fd.append("password", formData.password);
      const response = await axios.post("/api/advocate/login", fd);
      if (response.data.success) {
        router.replace("/advocates/post-content");
        localStorage.setItem("currentLawyer", response.data.lawyer);
      }
    } catch (e) {
      if (isAxiosError(e)) {
        toast.error(
          e.response?.data.message || "Invalid email or password. Try again."
        );
      } else {
        toast.error("Invalid email or password. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const l = localStorage.getItem("currentLawyer");
    if (l) setLawyer(l);
  }, []);

  useEffect(() => {
    if (!lawyer) return;
    router.replace("/advocates/post-content");
  }, [lawyer]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="container mx-auto p-8 bg-gray-950 rounded-xl shadow-2xl w-full max-w-md border border-[#C0C0C0]">
        <h1 className="text-3xl font-bold text-center mb-6 bg-[#C0C0C0] text-black px-6 py-3 rounded-lg shadow-md border border-gray-700">
          Login
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center bg-gray-800 px-4 py-3 rounded-lg border border-[#C0C0C0]">
            <User className="text-[#C0C0C0] mr-3" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full bg-transparent focus:outline-none text-white placeholder-gray-400"
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center bg-gray-800 px-4 py-3 rounded-lg border border-[#C0C0C0] relative">
            <Lock className="text-[#C0C0C0] mr-3" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              className="w-full bg-transparent focus:outline-none text-white placeholder-gray-400"
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute right-4 text-[#C0C0C0] hover:text-white transition duration-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3 rounded-lg bg-[#C0C0C0] text-black font-semibold hover:bg-white transition duration-300"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-4">
          Don&apos;t have an account?{" "}
          <a
            href="/advocates/register"
            className="text-[#C0C0C0] underline hover:text-white"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
