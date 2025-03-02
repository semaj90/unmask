"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { User, Star } from "lucide-react"; // Importing icons
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lawyer } from "../lawyer/[id]/page";

const LawyerPage = () => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setError("");
        const response = await axios.get<Lawyer[]>("/api/lawyers");
        setLawyers(response.data);
      } catch {
        setError("Could not fetch lawyers");
      }
    };

    fetchLawyers();
  }, []);

  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <Star key={index} className="text-[#C0C0C0]" size={20} />
        ))}
        {halfStar && (
          <Star key="half" className="text-[#C0C0C0] opacity-50" size={20} />
        )}
        <span className="ml-2 text-[#C0C0C0] font-semibold">
          {rating.toFixed(1)}
        </span>
      </>
    );
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-r from-black via-gray-900 to-black text-center">
        <h1 className="text-5xl font-bold mb-4 flex items-center justify-center bg-[#C0C0C0] text-black px-6 py-3 rounded-lg shadow-lg">
          <User className="mr-4 text-black" size={40} /> Lawyer Dictionary
        </h1>
        <p className="text-xl max-w-2xl mx-auto text-[#C0C0C0]">
          Discover detailed information about top-rated lawyers and find the
          best legal support for your needs.
        </p>
      </div>

      {/* Available Lawyers Section */}
      <div className="container mx-auto p-6">
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lawyers.map((lawyer, index) => (
            <div
              key={index}
              className="p-6 bg-gray-950 rounded-lg shadow-lg border border-[#C0C0C0]"
            >
              <h2 className="text-2xl font-semibold text-black flex items-center bg-[#C0C0C0] px-4 py-2 rounded-md shadow-md">
                <User className="mr-2 text-black" />
                {lawyer.name}
              </h2>
              <div className="text-gray-300 mt-3 flex flex-col space-y-2">
                <p className="mr-4 text-white">
                  <strong className="text-[#C0C0C0]">Experience:</strong>{" "}
                  {lawyer.experience} years
                </p>
                <p className="flex items-center text-white">
                  <strong className="text-[#C0C0C0]">Rating:</strong>
                  <span className="ml-2 flex">
                    {renderRating(
                      parseFloat(lawyer.user_rating.$numberDecimal)
                    )}
                  </span>
                </p>
              </div>
              <p className="mt-4 text-gray-300">
                <strong className="text-[#C0C0C0]">Description:</strong>{" "}
                {lawyer.description}
              </p>
              <Link href={`/lawyer/${lawyer._id}`}>
                <Button className="bg-white hover:bg-gray-300 text-black mt-10 font-bold">
                  Learn More
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LawyerPage;
