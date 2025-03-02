import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import LawyerPostCard from "@/components/advocatePostCard";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";

const AdvocatesDashboard = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="px-4 md:px-6">
      {session && session.user._id ? (
        <div className="flex justify-end bg-transparent">
          <Link
            className="px-4 py-2 border border-white rounded-md mt-6 mr-8"
            href="/advocates/profile"
          >
            Profile
          </Link>
        </div>
      ) : (
        <div className="flex justify-end bg-transparent">
          <Link
            className="px-4 py-2 border border-white rounded-md mt-6 mr-8"
            href="/advocates/login"
          >
            Sign In as Advocate
          </Link>
        </div>
      )}
      <div className="relative min-h-screen py-6">
        <LawyerPostCard />
      </div>
    </div>
  );
};

export default AdvocatesDashboard;
