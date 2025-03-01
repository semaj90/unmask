import { ReportModel } from "@/models/Report";
import { connectDB } from "@/utils/dbTest";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const reportId = url.pathname.split("/").pop();

    if (!reportId) {
      throw new Error("No Id provided");
    }

    const report = await ReportModel.findById(reportId);

    if (!report) {
      throw new Error("No report found");
    }

    return NextResponse.json(
      { message: "Report found", report },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message, success: false },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Internal Server Error", success: false },
        { status: 500 }
      );
    }
  }
}
