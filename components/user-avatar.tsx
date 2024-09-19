"use client";

import Image from "next/image";
import {
  FaUserAstronaut,
  FaUserCircle,
  FaUserLock,
  FaUserNinja,
} from "react-icons/fa";

import { generateInitials } from "@/lib/utils";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface UserAvatarProps {
  className?: string;
  height: number;
  width: number;
}

export const UserAvatar = ({
  className,
  width = 48,
  height = 48,
}: UserAvatarProps) => {
  const user = useCurrentUser();
  const [imageError, setImageError] = useState(false);
  return (
    <div
      className={`relative text-xl rounded-full overflow-hidden ${className}`}
    >
      {user && user.image && !imageError ? (
        <Image
          src={user.image}
          alt={user.name || "User Avatar"}
          width={width}
          height={height}
          className="rounded-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : user && user.name ? (
        <div className="flex items-center justify-center h-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full">
          {generateInitials(user.name)}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full">
          <FaUserNinja className="text-2xl" />
        </div>
      )}
    </div>
  );
};
