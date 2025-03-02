import LawyerPost from "@/models/LawyerPost";
import { connectDB } from "@/utils/dbTest";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user._id) throw new Error("Lawyer not found");

    const lawyerId = session.user._id;
    const fd = await req.formData();

    const lawyerPost = {
      title: fd.get("title") as string,
      content: fd.get("content") as string,
      genre: fd.get("genre") as string,
      lawyer: lawyerId,
    };

    if (!lawyerPost) {
      throw new Error("Missing required fields");
    }

    await LawyerPost.create({
      ...lawyerPost,
    });

    return NextResponse.json(
      { message: "Post created", success: true },
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

export async function GET() {
  await connectDB();

  try {
    const lawyerPosts = await LawyerPost.aggregate([
      {
        $lookup: {
          from: "lawyers", // The name of the Lawyer collection
          localField: "lawyer", // The field in LawyerPost that stores the lawyer's ID
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

    console.log(lawyerPosts);

    return NextResponse.json(
      { message: "Posts fetched successfully", lawyerPosts, success: true },
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
