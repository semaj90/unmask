/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Cal from "@calcom/embed-react";

const BookLawyerMeeting = () => {
  return (
    <Dialog>
      <DialogTrigger className="bg-[#C0C0C0] text-black p-4 font-medium rounded-md">
        Connect With Lawyer
      </DialogTrigger>
      <DialogContent className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book a call</DialogTitle>
          <DialogDescription>
            Book a call with this lawyer to discuss your legal issues.
          </DialogDescription>
        </DialogHeader>
        <div className="pb-8">
          <Cal
            calLink="tech-janta-party/30min"
            style={{ width: "100%", height: "600px" }}
          ></Cal>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookLawyerMeeting;
