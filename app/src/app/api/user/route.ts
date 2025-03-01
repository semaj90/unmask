import { UserModel } from "@/models/User";
import { connectDB } from "@/utils/dbTest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { userAddress } = await req.json();

    if (!userAddress) {
      throw new Error("No user address provided");
    }

    await UserModel.create({
      address: userAddress,
    });

    return NextResponse.json(
      { message: "User created", success: true },
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
