"use client";

import React from "react";
import WithWalletProtection from "../withProtected";
import AllPosts from "@/components/AllPosts";
import CreatePost from "@/components/CreatePost";
import Link from "next/link";

const Home = () => {
  return (
    <div className="min-h-screen px-6 py-4 md:px-8 md:py-6 bg-gradient-to-bl from-[#151515] via-[#292929] to-[#151515]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome user!</h1>
          <h2 className="text-lg font-medium">
            See what people are reporting about
          </h2>
        </div>
        <Link href={"/advocates/register"}>
          <button className="shadow-2xl z-50 font-bold cursor-pointer border text-sm border-white hover:bg-white/5 p-4 rounded-md flex items-center justify-center gap-2">
            Join as Advocate
          </button>
        </Link>
      </div>
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-12">
        {/* CreatePost appears first on mobile but stays on the right on large screens */}
        <div className="order-1 lg:order-2">
          <CreatePost />
        </div>

        {/* AllPosts appears second on mobile but spans 2/3 on large screens */}
        <div className="order-2 lg:order-1 lg:col-span-2">
          <AllPosts />
        </div>
      </main>
    </div>
  );
};

export default WithWalletProtection(Home);
