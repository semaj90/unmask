"use client";

import { useState } from "react";
import axios, { isAxiosError } from "axios";
import { FileText, BookOpen, List } from "lucide-react"; // Icons for input fields
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const PostContentForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    genre: "Law Learnings",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const qc = useQueryClient();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("content", formData.content);
      fd.append("genre", formData.genre);

      const response = await axios.post("/api/advocate/post", fd);
      if (response.data.success) {
        qc.invalidateQueries({
          queryKey: ["lawyerPosts"],
          exact: true,
        });
        qc.invalidateQueries({
          queryKey: ["profilePosts"],
          exact: true,
        });
        setFormData({
          title: "",
          content: "",
          genre: "Law Learnings",
        });
      }
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data.message || "Post failed. Try again.");
      } else {
        toast.error("Post failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mb-8 text-white sticky top-6">
      <div className="container mx-auto p-8 bg-gray-950 rounded-xl shadow-2xl w-full max-w-md border border-[#C0C0C0]">
        <h1 className="text-3xl font-bold text-center mb-6 bg-[#C0C0C0] text-black px-6 py-3 rounded-lg shadow-md border border-gray-700">
          Create a Post
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Field */}
          <div className="flex items-center bg-gray-800 px-4 py-3 rounded-lg border border-[#C0C0C0]">
            <BookOpen className="text-[#C0C0C0] mr-3" size={20} />
            <input
              type="text"
              name="title"
              placeholder="Post Title"
              required
              className="w-full bg-transparent focus:outline-none text-white placeholder-gray-400"
              onChange={handleChange}
            />
          </div>

          {/* Content Field */}
          <div className="flex items-start bg-gray-800 px-4 py-3 rounded-lg border border-[#C0C0C0]">
            <FileText className="text-[#C0C0C0] mr-3 mt-1" size={20} />
            <textarea
              name="content"
              placeholder="Write your content here..."
              required
              className="w-full bg-transparent focus:outline-none text-white placeholder-gray-400 h-40 resize-none"
              onChange={handleChange}
            />
          </div>

          {/* Genre Dropdown */}
          <div className="flex items-center bg-gray-800 px-4 py-3 rounded-lg border border-[#C0C0C0]">
            <List className="text-[#C0C0C0] mr-3" size={20} />
            <select
              name="genre"
              required
              className="w-full bg-transparent focus:outline-none text-white placeholder-gray-400"
              onChange={handleChange}
              value={formData.genre}
            >
              <option value="Law Learnings" className="text-black">
                Law Learnings
              </option>
              <option value="Constitution Facts" className="text-black">
                Constitution Facts
              </option>
              <option value="Case Analysis" className="text-black">
                Case Analysis
              </option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 py-3 rounded-lg bg-[#C0C0C0] text-black font-semibold hover:bg-white transition duration-300"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostContentForm;
