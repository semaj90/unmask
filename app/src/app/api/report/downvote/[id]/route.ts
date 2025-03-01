import { ReportModel } from "@/models/Report";
import { connectDB } from "@/utils/dbTest";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/")[4];
    const { userAddress } = await req.json();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid Report ID", success: false },
        { status: 400 }
      );
    }

    // First, get the current report to check its state
    const report = await ReportModel.findById(id);

    if (!report) {
      return NextResponse.json(
        { message: "Report not found", success: false },
        { status: 404 }
      );
    }

    const hasDownvoted = report.downvotes.includes(userAddress);

    // Update based on current state
    if (hasDownvoted) {
      // Remove upvote if already upvoted
      await ReportModel.findByIdAndUpdate(id, {
        $pull: { downvotes: userAddress },
      });
    } else {
      // Add upvote if not already upvoted
      await ReportModel.findByIdAndUpdate(id, {
        $push: { downvotes: userAddress },
      });
    }

    // Always remove from downvotes regardless of upvote status
    await ReportModel.findByIdAndUpdate(id, {
      $pull: { upvotes: userAddress },
    });

    // Get updated report for response
    const updatedReport = await ReportModel.findById(id);

    return NextResponse.json(
      {
        message: hasDownvoted ? "Downvote removed" : "Downvote added",
        success: true,
        upvotes: updatedReport?.upvotes || [],
        downvotes: updatedReport?.downvotes || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in upvote handler:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        success: false,
      },
      { status: 500 }
    );
  }
}
