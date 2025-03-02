"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { User, Star, BookOpen, Landmark, Scale } from "lucide-react"; // Icons
import { LoaderIcon } from "react-hot-toast";

export interface Post {
  _id: string;
  title: string;
  content: string;
  genre: string;
  lawyerDetails: {
    _id: string;
    name: string;
  };
}

const LawyerPostShowcase = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["lawyerPosts"],
    queryFn: async () => {
      const response = await axios.get("/api/advocate/post");
      return response.data.lawyerPosts as Post[];
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading && !posts)
    return (
      <div className="max-w-4xl w-full mx-auto">
        <LoaderIcon className="size-6 text-white" />
      </div>
    );

  return (
    posts &&
    posts.length !== 0 && (
      <div className="max-w-5xl w-full mx-auto space-y-6">
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
    )
  );
};

export default LawyerPostShowcase;
