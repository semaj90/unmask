import Lawyer from "@/models/Lawyer";
import { connectDB } from "@/utils/dbTest";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  try {
    const lawyer = await Lawyer.findById(id);
    if (!lawyer) {
      return NextResponse.json(
        { message: "Lawyer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ lawyer }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error },
      { status: 500 }
    );
  }
}
