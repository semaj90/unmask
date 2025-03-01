import LawyerPostCard from "@/components/advocatePostCard";
import PostContentForm from "@/components/createAdvocatePost";
import Link from "next/link";
import React from "react";

const AdvocatesDashboard = () => {
  return (
    <div className="px-20">
      <div className="flex justify-end bg-transparent">
        <Link
          className="px-4 py-2 border border-white rounded-md mt-6 mr-8"
          href="/advocates/profile"
        >
          Profile
        </Link>
      </div>
      <div className="relative min-h-screen flex flex-col-reverse lg:flex-row gap-4 justify-center py-6">
        <LawyerPostCard />
        <div className="w-full max-w-2xl text-white p-8 rounded-xl">
          <PostContentForm />
        </div>
      </div>
    </div>
  );
};

export default AdvocatesDashboard;
