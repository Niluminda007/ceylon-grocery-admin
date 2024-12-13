import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { CldImage } from "next-cloudinary";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";

export type CategoryTD = {
  id: string;
  image: string;
  name: string;
};
export const columns: ColumnDef<CategoryTD>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all categories"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Select category ${row.getValue("name")}`}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <div className="w-32 h-32 rounded-lg overflow-hidden shadow-md">
        <CldImage
          width={128}
          height={128}
          format="webp"
          quality="80"
          alt={`Image of ${row.getValue("name")}`}
          src={row.getValue("image")}
          className="object-cover"
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-semibold px-0"
      >
        Category Name
        {column.getIsSorted() ? (
          column.getIsSorted() === "asc" ? (
            <ChevronUpIcon className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          )
        ) : (
          <CaretSortIcon className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-lg text-neutral-900 font-medium">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip delayDuration={150}>
          <TooltipTrigger>
            <Link
              href={`categories/edit/${row.original.id}`}
              className="w-full cursor-pointer text-lg"
            >
              <FaEdit />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Update Category</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
];
