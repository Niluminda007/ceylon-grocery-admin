import Logo from "@/components/logo";
import { UserAvatar } from "@/components/user-avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./log-out-button";

const Header = () => {
  return (
    <div className="fixed top-0 left-0 z-[20] w-full px-4 md:px-8 lg:px-16 py-4  shadow-xl flex justify-between items-center">
      <Link href={"/"}>
        <div className="flex space-x-2 items-center ">
          <Logo />
          <span className="text-sm md:text-lg text-black font-medium">
            Ceylon Grocery Admin
          </span>
        </div>
      </Link>
      <LogoutButton />
    </div>
  );
};

export default Header;
