import mongoose from "mongoose";

const LawyerCommentSchema = new mongoose.Schema(
  {
    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lawyer",
    },
    comment: {
      type: String,
      required: true,
    },
    commentedOn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
  },
  { timestamps: true }
);

const LawyerComment =
  mongoose.models.LawyerComment ||
  mongoose.model("LawyerComment", LawyerCommentSchema);

export default LawyerComment;
