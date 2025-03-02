import mongoose from "mongoose";

const LawyerPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    lawyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lawyer",
      required: true,
    },
  },
  { timestamps: true }
);

const LawyerPost =
  mongoose.models.LawyerPost || mongoose.model("LawyerPost", LawyerPostSchema);

export default LawyerPost;
