import Image from "next/image";
import React from "react";

interface LogoProps {
  className?: string;
  height?: number;
  width?: number;
}

const Logo = ({ className, height = 100, width = 100 }: LogoProps) => {
  return (
    <Image
      className={`w-10 h-10 object-contain ${className}`}
      src="/logo.png"
      alt="logo"
      height={height}
      width={width}
    />
  );
};

export default Logo;
