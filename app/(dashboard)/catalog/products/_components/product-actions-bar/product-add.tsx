import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import React from "react";
import { FaPlus } from "react-icons/fa";

export const ProductAdd = () => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>
          <Link
            className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center transition ease-linear hover:scale-110 hover:bg-neutral-700 shadow-md hover:shadow-lg"
            href={"products/add-new"}
            aria-label="Add New Product"
          >
            <FaPlus />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add New Product</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
