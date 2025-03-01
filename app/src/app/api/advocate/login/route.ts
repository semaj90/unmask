import { connectDB } from "@/utils/dbTest";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import Lawyer from "@/models/Lawyer";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const fd = await req.formData();

    const advocate = {
      email: fd.get("email") as string,
      password: fd.get("password") as string,
    };

    const lawyer = await Lawyer.findOne({ email: advocate.email });

    const isPasswordMatch = await bcrypt.compare(
      advocate.password,
      lawyer.password
    );

    if (!isPasswordMatch) {
      throw new Error("Invalid credentials");
    }

    return NextResponse.json(
      { message: "Login Successful", success: true, lawyer: lawyer._id },
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
