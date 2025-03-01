/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useContext } from "react";
import PrimaryButton from "./PrimaryButton";
import { WalletContext } from "@/context/Wallet";
import SecondaryButton from "./SecondaryButton";
import Link from "next/link";
import { connectWallet } from "@/utils/connectWallet";

declare global {
  interface Window {
    ethereum: any;
  }
}

const WalletConnectButton = () => {
  const {
    setIsConnected,
    setUserAddress,
    setSigner,
    isConnected,
    userAddress,
  } = useContext(WalletContext);

  return (
    <div className="flex flex-col gap-6">
      <PrimaryButton
        disabled={isConnected}
        onClick={async () => {
          await connectWallet(setIsConnected, setUserAddress, setSigner);
        }}
      >
        {userAddress
          ? `${userAddress.slice(0, 12)}...${userAddress.slice(-13)}`
          : "Connect Wallet"}
      </PrimaryButton>
      {isConnected && userAddress && (
        <Link href={"/home"}>
          <SecondaryButton className="w-full">Raise Voice</SecondaryButton>
        </Link>
      )}
    </div>
  );
};

export default WalletConnectButton;
