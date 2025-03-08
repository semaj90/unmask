"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { User } from "lucide-react"; // Importing icons
// import Link from "next/link";

export interface Lawyer {
  _id: string;
  name: string;
  experience: number;
  description: string;
  user_rating: {
    $numberDecimal: string;
  };
  phone: string;
  email: string;
}

const LawyerPage = () => {
  const { id } = useParams();
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (id) {
      fetchLawyer(id as string);
    }
  }, [id]);

  const fetchLawyer = async (lawyerId: string) => {
    try {
      setError("");
      const response = await axios.get(`/api/lawyer?id=${lawyerId}`);
      setLawyer(response.data.lawyer);
    } catch {
      setLawyer(null);
      setError("Lawyer not found");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="container mx-auto p-8 bg-gray-950 rounded-xl shadow-2xl w-full max-w-3xl border border-[#C0C0C0]">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold flex justify-center items-center mb-6 bg-[#C0C0C0] text-black px-6 py-3 rounded-lg shadow-md border border-gray-700">
            <User className="mr-3 text-black" size={30} /> Lawyer Details
          </h1>
          {error && <p className="text-red-500">{error}</p>}
        </div>

        {lawyer ? (
          <div className="p-6 bg-gray-900 rounded-lg shadow-lg border border-[#C0C0C0]">
            <h2 className="text-3xl font-semibold flex justify-center items-center mb-6 bg-[#C0C0C0] text-black px-6 py-3 rounded-lg shadow-md border border-gray-700">
              <User className="mr-2 text-black" size={28} />
              {lawyer.name}
            </h2>

            <div className="text-white mt-3 flex justify-between items-center bg-gray-800 px-6 py-3 rounded-lg shadow-md mb-4 border border-[#C0C0C0]">
              <p className="font-medium">
                <strong className="text-[#C0C0C0]">Experience:</strong>{" "}
                {lawyer.experience} years
              </p>
              <p className="flex items-center font-medium">
                <strong className="text-[#C0C0C0]">Rating:</strong>
                <span className="ml-2 flex text-lg font-bold text-[#C0C0C0]">
                  {lawyer.user_rating.$numberDecimal}
                </span>
              </p>
            </div>
            {/* <div className="text-white mt-3 flex justify-between items-center bg-gray-800 px-6 py-3 rounded-lg shadow-md mb-4 border border-[#C0C0C0]">
              <p className="font-medium">
                <strong className="text-[#C0C0C0]">Call:</strong> {lawyer.phone}
              </p>
              <p className="flex items-center font-medium">
                <strong className="text-[#C0C0C0]">Email:</strong>
                <Link
                  href={`mailto:${lawyer.email}`}
                  className="ml-2 flex text-lg font-bold text-[#C0C0C0]"
                >
                  {lawyer.email}
                </Link>
              </p>
            </div> */}
            

            <p className="mt-4 text-white bg-gray-800 px-6 py-3 rounded-lg shadow-md border border-[#C0C0C0]">
              <strong className="text-[#C0C0C0]">Description:</strong>{" "}
              {lawyer.description}
            </p>
            <div className="text-white mt-3 hover:scale-105 flex justify-center items-center bg-gray-800 px-6 py-3 rounded-lg shadow-md mb-4 border border-[#C0C0C0]">
              <p className="font-medium">
                <button>Connect Lawyer</button>
              </p>
            </div>
          </div>
          
        ) : (
          <div className="mt-6 text-center text-[#C0C0C0]">
            <svg
              className="animate-spin h-10 w-10 text-[#C0C0C0] mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            <p className="mt-3">Fetching details...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LawyerPage;
