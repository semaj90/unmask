import React from "react";
import Image from "next/image";
import { Report } from "@/app/(protected)/report/[id]/page";
import Link from "next/link";

const PostItem = ({ report }: { report: Report }) => {
  return (
    <Link href={"/report/" + report._id} className="h-[150px]">
      <div className="mb-6 bg-white rounded-md border shadow-xl flex flex-row gap-4 items-start px-6 py-4 h-full">
        {/* Image on the left for large screens, on top for small screens */}
        <div className="overflow-hidden size-[100px] flex-shrink-0">
          <Image
            src={report.image}
            alt="Post Image"
            width={100}
            height={100}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        {/* Text on the right for large screens, below image on small screens */}
        <div className="sm:ml-4 mt-3 sm:mt-0 text-black sm:text-left">
          <h2 className="text-lg font-semibold line-clamp-2">{report.name}</h2>
          <p className="text-sm line-clamp-3">{report.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default PostItem;
