import React from "react";

type PrimaryButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

const PrimaryButton = ({
  children,
  onClick,
  className,
  disabled = false,
}: PrimaryButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${className} shadow-2xl z-50 cursor-pointer border border-white bg-white hover:bg-white/90 text-gray-800 font-bold p-4 rounded-md text-base flex items-center justify-center gap-2`}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
