"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { isAxiosError } from "axios";
import { User, Lock, Mail, Phone, FileText, Briefcase } from "lucide-react"; // Icons for input fields
import toast from "react-hot-toast";

const SignupPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    description: "",
    experience: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone);
      fd.append("password", formData.password);
      fd.append("description", formData.description);
      fd.append("experience", formData.experience);

      const response = await axios.post("/api/advocate/signup", fd);
      if (response.data.success) router.replace("/advocates/login");
    } catch (e) {
      if (isAxiosError(e)) {
        toast.error(e.response?.data.message || "Signup failed. Try again.");
      } else {
        toast.error("Signup failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="container mx-auto p-8 bg-gray-950 rounded-xl shadow-2xl w-full max-w-md border border-[#C0C0C0]">
        <h1 className="text-3xl font-bold text-center mb-6 bg-[#C0C0C0] text-black px-6 py-3 rounded-lg shadow-md border border-gray-700">
          Sign Up
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="flex items-center bg-gray-800 px-4 py-3 rounded-lg border border-[#C0C0C0]">
            <User className="text-[#C0C0C0] mr-3" size={20} />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              className="w-full bg-transparent focus:outline-none text-white placeholder-gray-400"
              onChange={handleChange}
            />
          </div>

          {/* Email Field */}
          <div className="flex items-center bg-gray-800 px-4 py-3 rounded-lg border border-[#C0C0C0]">
            <Mail className="text-[#C0C0C0] mr-3" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full bg-transparent focus:outline-none text-white placeholder-gray-400"
              onChange={handleChange}
            />
          </div>

          {/* Phone Number Field */}
          <div className="flex items-center bg-gray-800 px-4 py-3 rounded-lg border border-[#C0C0C0]">
            <Phone className="text-[#C0C0C0] mr-3" size={20} />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              className="w-full bg-transparent focus:outline-none text-white placeholder-gray-400"
              onChange={handleChange}
            />
          </div>

          {/* Password Field */}
          <div className="flex items-center bg-gray-800 px-4 py-3 rounded-lg border border-[#C0C0C0]">
            <Lock className="text-[#C0C0C0] mr-3" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full bg-transparent focus:outline-none text-white placeholder-gray-400"
              onChange={handleChange}
            />
          </div>

          {/* Experience Field */}
          <div className="flex items-center bg-gray-800 px-4 py-3 rounded-lg border border-[#C0C0C0]">
            <Briefcase className="text-[#C0C0C0] mr-3" size={20} />
            <input
              type="number"
              name="experience"
              placeholder="Experience (in years)"
              required
              className="w-full bg-transparent focus:outline-none text-white placeholder-gray-400"
              onChange={handleChange}
              min="0"
            />
          </div>

          {/* Description Field */}
          <div className="flex items-start bg-gray-800 px-4 py-3 rounded-lg border border-[#C0C0C0]">
            <FileText className="text-[#C0C0C0] mr-3 mt-1" size={20} />
            <textarea
              name="description"
              placeholder="Brief Description"
              required
              className="w-full bg-transparent focus:outline-none text-white placeholder-gray-400 h-20 resize-none"
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 py-3 rounded-lg bg-[#C0C0C0] text-black font-semibold hover:bg-white transition duration-300"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <a
            href="/advocates/login"
            className="text-[#C0C0C0] underline hover:text-white"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
