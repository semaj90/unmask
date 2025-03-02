"use client";

import React, { useContext, useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "@/utils/pinata";
import toast, { LoaderIcon } from "react-hot-toast";
import { ethers } from "ethers";
import marketplace from "@/app/marketplace.json";
import { WalletContext } from "@/context/Wallet";

import axios from "axios";
import { connectWallet } from "@/utils/connectWallet";
import { useQueryClient } from "@tanstack/react-query";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const nftPrice = "1000";
  const {
    userAddress,
    signer,
    isConnected,
    setSigner,
    setUserAddress,
    setIsConnected,
  } = useContext(WalletContext);
  const [loading, setLoading] = useState<boolean>(false);

  const qc = useQueryClient();

  async function uploadImageToPinata() {
    if (!image) return null;
    try {
      const fd = new FormData();
      fd.append("file", image as Blob);
      const uploadPromise = uploadFileToIPFS(fd);

      toast.promise(uploadPromise, {
        loading: "Uploading Image...",
        success: "Image Uploaded Successfully",
        error: "Error during file upload",
      });

      const response = await uploadPromise;
      return response.success ? response.pinataURL : null;
    } catch {
      toast.error("Error uploading image");
      return null;
    }
  }

  async function uploadMetadataToIPFS() {
    if (!title || !content || !image) {
      toast.error("Title and Content are required");
      return null;
    }

    const imageFileUrl = await uploadImageToPinata();
    if (!imageFileUrl) return null;

    const nftJSON = {
      name: title,
      description: content,
      price: nftPrice,
      image: imageFileUrl,
    };

    try {
      const response = await uploadJSONToIPFS(nftJSON);
      return response.success ? response.pinataURL : null;
    } catch (e) {
      console.log("Error uploading JSON metadata: ", e);
      return null;
    }
  }

  async function reportNFT(metadataURL: string) {
    try {
      // Fetch the metadata JSON from IPFS
      const response = await fetch(metadataURL);
      const metadata = await response.json(); // Parse JSON

      if (!metadata.image) {
        toast.error("Invalid metadata: No image URL found");
        return;
      }

      const fd = new FormData();
      fd.append("description", content);
      fd.append("image", metadata.image); // Save the actual image URL
      fd.append("name", title);
      if (userAddress) {
        fd.append("reportedBy", userAddress);
      }

      await axios.post("/api/report", fd);
    } catch (e) {
      console.log("Error fetching metadata or reporting NFT: ", e);
      toast.error("Failed to report NFT");
    }
  }

  async function checkContent(content: string, title: string) {
    const fd = new FormData();
    fd.append("content", content);
    fd.append("title", title);

    try {
      setLoading(true);
      const res = await axios.post("/api/check-content", fd);
      return res.data.success ? res.data.result : null;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function precheck() {
    const res = await checkContent(title, content);

    if (res) {
      toast.error("Content is inappropriate");
      return;
    }

    await listNFT();
  }

  async function listNFT() {
    if (!isConnected) {
      await connectWallet(setIsConnected, setUserAddress, setSigner);
      return;
    }

    setLoading(true);
    try {
      const metadataURLPromise = uploadMetadataToIPFS();
      toast.promise(metadataURLPromise, {
        loading: "Uploading Metadata...",
        success: "Metadata Uploaded Successfully",
        error: "Metadata Upload Failed",
      });

      const metadataURL = await metadataURLPromise;
      if (!metadataURL) return;

      const contract = new ethers.Contract(
        marketplace.address,
        marketplace.abi,
        signer
      );
      const price = ethers.parseEther(nftPrice);

      const transactionPromise = contract.createToken(metadataURL, price);
      toast.promise(transactionPromise, {
        loading: "Creating NFT...",
        error: "Error creating NFT",
      });

      const transaction = await transactionPromise;
      await transaction.wait();

      toast.success("NFT Listed Successfully");

      // Call reportNFT after NFT is listed
      await reportNFT(metadataURL);

      qc.invalidateQueries({
        queryKey: ["reports"],
        exact: true,
      });

      setTitle("");
      setContent("");
      setImage(null);
    } catch (e) {
      toast.error("Failed to list NFT");
      console.log("Error listing NFT: ", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white bg-opacity-10 text-black col-span-1 w-full shadow-2xl py-6 px-4 rounded-md sticky top-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 text-white -rotate-12  mt-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46"
          />
        </svg>

        <h2 className="text-lg font-bold text-white">Create a new post</h2>
      </div>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="text-black rounded-md p-2 border border-black"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="text-black rounded-md p-2 border border-black"
        />
        <input
          onChange={(e) => {
            if (e.target.files) {
              setImage(e.target.files[0]);
            }
          }}
          className="text-white"
          type="file"
          accept="image/*"
        />
        <button
          disabled={loading}
          className="bg-white shadow-2xl z-50 cursor-pointer border border-black hover:bg-white/85 text-gray-800 font-bold p-4 rounded-md text-base flex items-center justify-center gap-2"
          onClick={precheck}
        >
          {loading ? (
            <LoaderIcon className="size-5 text-black" />
          ) : (
            "Create Post"
          )}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
