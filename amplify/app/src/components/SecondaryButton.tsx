import React from "react";

type SecondaryButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

const SecondaryButton = ({
  children,
  onClick,
  className,
  disabled = false,
}: SecondaryButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${className} shadow-2xl z-50 font-bold cursor-pointer border border-white hover:bg-white/5 p-4 rounded-md text-base flex items-center justify-center gap-2`}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
