"use client";
import Image from "next/image";
import ceylonLogo from "@/public/ceylon-logo-full.jpg";
import bgAuthMobile from "@/public/auth/auth-bg_mobile_2.jpg";

export const AuthBackground = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full md:h-auto md:static md:flex md:w-[50%] md:bg-black items-center justify-center">
      <div className="relative w-full h-full md:hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60 z-[10]" />

        <Image
          src={bgAuthMobile}
          alt="Auth background mobile"
          layout="fill"
          objectFit="cover"
          quality={75}
          priority
          className="z-[0]"
        />
      </div>

      <div className="hidden md:flex justify-center items-center">
        <Image
          src={ceylonLogo}
          alt="ceylon-grocery-logo"
          quality={75}
          priority
          height={"450"}
          width={"450"}
        />
      </div>
    </div>
  );
};
