"use client";

import { ProductType } from "@/types/productTypes";
import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import InStock from "./InStock";
type ProductTableProps = {
  prodcuts: Array<ProductType> | [];
};
const ProductTable = ({ prodcuts }: ProductTableProps) => {
  const data = useMemo(() => prodcuts, []);
  const columnHelper = createColumnHelper<ProductType>();
  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("weight", {
      header: "Weight",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("price", {
      header: "Price (€)",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("inStock", {
      header: "Availability",
      cell: (info) => {
        return (
          <InStock id={info.row.original._id} availability={info.getValue()} />
        );
      },
    }),
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col items-center gap-4 sm:w-[80%] w-[60%]">
      <h1 className="text-white text-3xl font-semibold">Products Table</h1>
      <table className="w-full p-8 bg=white border-none rounded-md">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="bg-[#5bfb23] sm:p-[2rem] font-bold ">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="font-medium text-left sm:text-[1.3rem] text-xs text-black mb-6 sm:p-5 p-2">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-[rgba(255,255,255,0.1)]">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className=" sm:p-[.75rem] text-white ">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="sm:p-5 text-xs sm:text-[1.1rem] sm:text-left text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
