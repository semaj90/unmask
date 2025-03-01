"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";

const queryClient = new QueryClient();

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-[#C0C0C0]">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </div>
  );
};

export default layout;
