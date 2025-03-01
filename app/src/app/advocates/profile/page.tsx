"use client";

import { Post } from "@/components/advocatePostCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  BookOpen,
  Landmark,
  LoaderCircle,
  Scale,
  Star,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

const Profile = () => {
  const [lawyer, setLawyer] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const l = localStorage.getItem("currentLawyer");
    if (l) setLawyer(l);
  }, []);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["profilePosts"],
    queryFn: async () => {
      const response = await axios.get(`/api/advocate/post/${lawyer}`);
      return response.data.lawyerPosts as Post[];
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading && !posts)
    return (
      <div className="max-w-4xl w-full mx-auto min-h-screen">
        <div className="flex justify-center items-center pt-8">
          <LoaderCircle className="size-5 text-white animate-spin" />
        </div>
      </div>
    );

  if (posts?.length === 0) {
    return (
      <div className="p-6 min-h-screen max-w-5xl w-full mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>
        <h2 className="text-lg font-medium text-white text-center">
          No posts yet.
        </h2>
      </div>
    );
  }

  return (
    posts &&
    posts.length !== 0 && (
      <div className="p-6 min-h-screen max-w-5xl w-full mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>
        <div className="space-y-6">
          {posts.map((post) => {
            let genreIcon;
            if (post.genre === "Constitution Facts") {
              genreIcon = <Landmark className="inline-block mr-2" size={18} />;
            } else if (post.genre === "Law Learnings") {
              genreIcon = <BookOpen className="inline-block mr-2" size={18} />;
            } else if (post.genre === "Case Analysis") {
              genreIcon = <Scale className="inline-block mr-2" size={18} />;
            }
            return (
              <div
                key={post._id}
                className="w-full bg-black text-white p-6 rounded-xl shadow-xl border border-[#C0C0C0]"
              >
                {/* Lawyer Info */}
                <div className="flex items-center mb-4">
                  <div className="bg-[#C0C0C0] p-2 rounded-full text-black">
                    <User size={24} />
                  </div>
                  <div className="ml-3 flex items-center">
                    <h3 className="text-lg font-semibold">
                      {post.lawyerDetails.name}
                    </h3>
                    <Star className="text-[#C0C0C0] ml-2" size={18} />
                  </div>
                </div>
                {/* Post Content */}
                <h2 className="text-xl font-bold bg-[#C0C0C0] text-black px-4 py-2 rounded-lg shadow-md border border-gray-700">
                  {post.title}
                </h2>
                <p className="text-gray-300 text-sm bg-gray-800 p-3 mt-3 rounded-lg border border-gray-700">
                  {post.content}
                </p>
                {/* Genre Tag */}
                <div className="mt-3 inline-block px-4 py-1 text-sm font-medium bg-gray-900 text-[#C0C0C0] rounded-full border border-gray-700">
                  {genreIcon} {post.genre}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )
  );
};

export default Profile;
