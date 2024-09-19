import React from "react";

interface LoaderProps {
  className?: string;
  text?: string;
  pulseClass?: string;
}

const Loader = ({ className, text = "Loading", pulseClass }: LoaderProps) => {
  return (
    <div className="flex flex-col justify-center items-center h-full space-y-4">
      <div className="relative">
        <div
          className={`animate-spin  rounded-full h-20 w-20 border-t-4 border-l-4 border-purple-400 ${className}`}
        ></div>
        <div className="absolute inset-0 flex justify-center items-center">
          <div
            className={`h-10 w-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-ping ${pulseClass}`}
          ></div>
        </div>
      </div>
      {text && (
        <p className="text-center text-lg font-medium text-neutral-800">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
