import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CaretSortIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { CldImage } from "next-cloudinary";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Link from "next/link";

import { FaEdit } from "react-icons/fa";

export type ProductTD = {
  id: string;
  category: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
  inStock: boolean;
};

export const columns: ColumnDef<ProductTD>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all products"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Select product ${row.getValue("name")}`}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md">
        <CldImage
          width="80"
          height="80"
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
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-semibold px-0"
      >
        Product Name
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
      <div className="text-sm text-neutral-900 font-medium">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="text-sm text-neutral-900 font-medium">
        {row.getValue("category")}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-semibold px-0"
      >
        Price
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
      <div className="text-sm text-neutral-900 font-medium ">{`€${row.getValue(
        "price"
      )}`}</div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <Button variant="ghost" className="font-semibold px-2">
        {row.getValue("quantity")}
      </Button>
    ),
  },
  {
    accessorKey: "inStock",
    header: "Availability",
    cell: ({ row }) => {
      const inStock = !!row.getValue("inStock");
      return (
        <div
          className={`${
            inStock ? "text-green-600" : "text-red-600 line-through"
          } text-sm font-semibold`}
        >
          {inStock ? "In Stock" : "Out of Stock"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip delayDuration={150}>
          <TooltipTrigger>
            <Link
              href={`products/edit/${row.original.id}`}
              className="w-full cursor-pointer text-lg"
            >
              <FaEdit />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Update Product</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
];
