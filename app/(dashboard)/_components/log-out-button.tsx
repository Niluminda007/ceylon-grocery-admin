"use client";

import { useState } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { logout } from "@/actions/logout";

export const LogoutButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    setIsLoading(true);
    try {
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="gap-8  flex relative" role="button">
          <UserAvatar
            height={40}
            width={40}
            className="w-10 h-10 shadow-none hover:shadow-md"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <div
            role="button"
            onClick={!isLoading ? onClick : undefined}
            className={`cursor-pointer flex items-center p-2 rounded-sm transition ease-in-out duration-150 text-neutral-600`}
          >
            <HiOutlineLogout className="text-sm mr-3" />
            <span className="text-sm font-semibold">
              {isLoading ? "Logging out..." : "Logout"}
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
