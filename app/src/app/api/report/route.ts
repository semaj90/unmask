import { ReportModel } from "@/models/Report";
import { connectDB } from "@/utils/dbTest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const fd = await req.formData();

    const report = {
      description: fd.get("description") as string,
      image: fd.get("image") as string,
      name: fd.get("name") as string,
      reportedBy: fd.get("reportedBy") as string,
    };

    console.log(report);

    if (!report) {
      throw new Error("Missing required fields");
    }

    await ReportModel.create({
      ...report,
    });

    return NextResponse.json(
      { message: "Report created successfully", success: true },
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

export async function GET() {
  await connectDB();

  try {
    const reports = await ReportModel.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "Reports fetched successfully", reports, success: true },
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
