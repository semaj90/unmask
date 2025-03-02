import { connectDB } from "@/utils/dbTest";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import Lawyer from "@/models/Lawyer";

export async function GET() {
  await connectDB();

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user._id) throw new Error("Lawyer not found");
    const lawyerId = session.user._id;

    const lawyer = await Lawyer.findById(lawyerId);

    return NextResponse.json(
      { message: "Lawyer Details fetched", success: true, lawyer: lawyer },
      { status: 201 }
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
