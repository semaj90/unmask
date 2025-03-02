/* eslint-disable @typescript-eslint/no-explicit-any */
import { WalletContext } from "@/context/Wallet";
import { connectWallet } from "@/utils/connectWallet";
import { uploadFileToIPFS, uploadJSONToIPFS } from "@/utils/pinata";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ethers } from "ethers";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import marketplace from "@/app/marketplace.json";
import { LoaderCircle } from "lucide-react";

const LawyerComment = ({ id }: { id: string }) => {
  const [comment, setComment] = useState("");

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
    try {
      const imagePath = "/unmask.png";
      const image = await fetch(imagePath);
      const imageBlob = await image.blob();

      const fd = new FormData();
      fd.append("file", imageBlob);
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
    if (!comment) {
      toast.error("Title and Content are required");
      return null;
    }

    const imageFileUrl = await uploadImageToPinata();
    if (!imageFileUrl) return null;

    const nftJSON = {
      name: "Comment",
      description: comment,
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
      fd.append("comment", comment);
      if (userAddress) {
        fd.append("reportedBy", userAddress);
      }

      await axios.post("/api/advocate/comment/" + id, fd);
    } catch (e) {
      console.log("Error fetching metadata or reporting NFT: ", e);
      toast.error("Failed to report NFT");
    }
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

      await reportNFT(metadataURL);

      qc.invalidateQueries({
        queryKey: ["lawyerComments", { id }],
        exact: true,
      });

      setComment("");
    } catch (e) {
      toast.error("Failed to list NFT");
      console.log("Error listing NFT: ", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="my-6">
      <p className="font-medium text-lg my-2">Reply to this post</p>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment here"
        className="text-black w-full max-w-xl rounded-md p-2 border border-black"
      />
      <div>
        <button
          onClick={listNFT}
          disabled={loading}
          className="bg-white text-black px-4 py-2 rounded-md mt-2"
        >
          {loading ? (
            <LoaderCircle className="size-5 animate-spin text-black" />
          ) : (
            "Post"
          )}
        </button>
      </div>
    </div>
  );
};

export default LawyerComment;
