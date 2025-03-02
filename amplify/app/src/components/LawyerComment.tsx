import React, { useState } from "react";

const LawyerComment = () => {
  const [comment, setComment] = useState("");

  return (
    <div className="my-6">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment"
        className="text-black w-full max-w-xl rounded-md p-2 border border-black"
      />
    </div>
  );
};

export default LawyerComment;
