import { connectDB } from "@/utils/dbTest";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/options";
import LawyerComment from "@/models/LawyerComment";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    const session = await getServerSession(authOptions);

    if (!session || !session.user._id) throw new Error("Unauthorized");

    const fd = await req.formData();

    const data = {
      comment: fd.get("comment") as string,
    };

    if (!data) {
      throw new Error("Missing required fields");
    }

    await LawyerComment.create({
      comment: data.comment,
      commentedBy: session.user._id,
      commentedOn: id,
    });

    return NextResponse.json(
      { message: "Lawyer Comment created successfully", success: true },
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

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    const comments = await LawyerComment.aggregate([
      {
        $match: { commentedOn: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "lawyers", // The name of the Lawyer collection
          localField: "commentedBy", // The field in LawyerPost that stores the lawyer's ID
          foreignField: "_id", // The field in Lawyer that matches the ID
          as: "lawyerDetails",
        },
      },
      {
        $unwind: "$lawyerDetails", // Convert lawyerDetails array to an object (optional)
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return NextResponse.json(
      { message: "Comments fetched successfully", comments, success: true },
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
