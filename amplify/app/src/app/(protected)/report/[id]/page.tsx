/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ReportDetailsComponent from "@/components/Report";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LoaderIcon } from "react-hot-toast";
import { useSession } from "next-auth/react";
import LawyerComment from "@/components/LawyerComment";

export interface Report {
  _id: string;
  reportedBy: string;
  description: string;
  image: string;
  name: string;
  upvotes: string[];
  downvotes: string[];
}

const ReportDetails = () => {
  const { id } = useParams();
  const { data: session } = useSession();

  const { isLoading, data: report } = useQuery({
    queryKey: ["report", { id }],
    queryFn: async () => {
      const res = await axios.get(`/api/report/${id}`);

      return res.data.report;
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ["lawyerComments", { id }],
    queryFn: async () => {
      const response = await axios.get(`/api/advocate/comment/${id}`);
      return response.data.comments;
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div>
        <LoaderIcon className="size-6 text-white" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-bl from-[#151515] via-[#292929] to-[#151515]">
        <p className="text-white font-bold text-2xl">No report found</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-bl from-[#151515] via-[#292929] to-[#151515] py-6 px-8">
      <div className="py-6 px-8 max-w-7xl mx-auto ">
        <div className="mt-12 justify-between gap-6 items-start flex">
          <ReportDetailsComponent report={report} />
          <div className="overflow-hidden">
            <Image
              className="w-full h-full"
              src={report.image}
              alt="Report Image"
              width={360}
              height={360}
            />
          </div>
        </div>
        {id && session && session.user && <LawyerComment id={id as string} />}
        <div className="my-10">
          {commentsLoading && (
            <div className="flex justify-center">
              <LoaderIcon className="size-4 text-white animate-spin" />
            </div>
          )}
          <p className="text-white  text-2xl font-medium underline underline-offset-8">
            Comments: {comments?.length}
          </p>
          <div>
            {comments?.map((comment: any) => {
              return (
                <div key={comment._id} className="my-4">
                  <p className="font-medium text-xl">{comment.comment}</p>
                  <p className="text-sm text-red-500">
                    Commented by:{" "}
                    <span className="text-white">
                      {comment.lawyerDetails.name}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ReportDetails;
