"use client";

import { useContext, useEffect } from "react";
import { WalletContext } from "@/context/Wallet";
import { useRouter } from "next/navigation";

const WithWalletProtection = (WrappedComponent: React.FC) => {
  const ComponentWithProtection: React.FC = (props) => {
    const { userAddress } = useContext(WalletContext);

    const router = useRouter();
    const walletAddress = userAddress;

    useEffect(() => {
      if (!walletAddress) {
        router.replace("/");
      }
    }, [walletAddress]);

    if (!walletAddress) return null; // Prevents flashing of protected content

    return <WrappedComponent {...props} />;
  };

  ComponentWithProtection.displayName = `WithWalletProtection(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ComponentWithProtection;
};

export default WithWalletProtection;
