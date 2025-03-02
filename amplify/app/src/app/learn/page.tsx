"use client";
import axios from "axios";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const ResponseGeneratorPage: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  async function generateAnswer(e: { preventDefault: () => void }) {
    setGeneratingAnswer(true);
    e.preventDefault();
    setAnswer("Generating Response...");
    try {
      const prompt = `
            You are an expert of Indian Constitution and you have been asked to explain the following question from the Indian constitutional and legal point of view. Answer in layman term. Answer in brief but keep the concept cleared
            ${question}
        `;
      console.log(prompt);

      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY}`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: prompt }] }],
        },
      });
      setAnswer(
        response["data"]["candidates"][0]["content"]["parts"][0]["text"]
      );
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }

    setGeneratingAnswer(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-[#C0C0C0] flex justify-center items-center p-6">
      <div className="w-full max-w-3xl bg-gray-950 text-white p-8 rounded-xl shadow-2xl border border-[#C0C0C0]">
        <h1 className="text-3xl font-bold text-center mb-6 bg-[#C0C0C0] text-black px-6 py-3 rounded-lg shadow-md border border-gray-700">
          Indian Law Dictionary
        </h1>

        <div className="space-y-4">
          {/* Question Input Box */}
          <div className="flex flex-col">
            <label className="text-xl font-semibold text-white mb-2">
              Enter Your Question
            </label>
            <textarea
              className="bg-gray-800 text-white p-4 rounded-lg border border-[#C0C0C0] focus:outline-none resize-none"
              rows={4}
              placeholder="Type your question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          {/* Generate Answer Button */}
          <div className="text-center mt-4">
            <button
              onClick={generateAnswer}
              className="py-3 px-6 rounded-lg bg-[#C0C0C0] text-black font-semibold hover:bg-white transition duration-300"
              disabled={generatingAnswer}
            >
              {generatingAnswer ? "Generating..." : "Generate Answer"}
            </button>
          </div>

          {/* Answer Display */}
          <div className="mt-6">
            <label className="text-xl font-semibold text-white mb-2">
              Generated Answer
            </label>
            <div className="bg-gray-800 text-white p-4 rounded-lg border border-[#C0C0C0] min-h-[150px]">
              {generatingAnswer ? (
                <div className="text-center">Generating response...</div>
              ) : (
                <ReactMarkdown>
                  {answer || "Your generated answer will appear here."}
                </ReactMarkdown>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseGeneratorPage;
