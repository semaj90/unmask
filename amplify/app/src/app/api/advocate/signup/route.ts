import { connectDB } from "@/utils/dbTest";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import Lawyer from "@/models/Lawyer";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const fd = await req.formData();

    const advocate = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      password: fd.get("password") as string,
      description: fd.get("description") as string,
      experience: fd.get("experience") as string,
    };

    const existingLawyer = await Lawyer.findOne({ email: advocate.email });

    if (existingLawyer) {
      throw new Error("Email already exists");
    }

    const salt = await bcrypt.genSalt(7);
    const hashedPassword = await bcrypt.hash(advocate.password, salt);

    // Save advocate to database

    await Lawyer.create({
      name: advocate.name,
      email: advocate.email,
      phone: advocate.phone,
      password: hashedPassword,
      description: advocate.description,
      experience: Number(advocate.experience),
      user_rating: 3.0,
    });

    return NextResponse.json(
      { message: "Advocate created", success: true },
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
