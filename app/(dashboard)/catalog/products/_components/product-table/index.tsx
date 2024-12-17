import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { columns } from "./columns";
import { Category, Product } from "@prisma/client";
import { decimalToNumber } from "@/lib/utils";
import { ProductActionsBar } from "../product-actions-bar";
import { ExtendedProduct } from "@/types/product";

interface ProductsTableProps {
  products: ExtendedProduct[];
  categories: Category[];
}

export const ProductsTable = ({ products, categories }: ProductsTableProps) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const data = React.useMemo(
    () =>
      products.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category.name,
        image: product.images[0],
        price: decimalToNumber(product.price),
        quantity: product.stockCount,
        inStock: product.inStock,
      })),
    [products]
  );

  const categoryData = React.useMemo(() => categories, [categories]);
  const columnsMemo = React.useMemo(() => columns, []);

  const table = useReactTable({
    data,
    columns: columnsMemo,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const selectedRowData = Object.keys(rowSelection).map(
    (rowId) => data[parseInt(rowId)]
  );

  const resetRowSelection = () => {
    setRowSelection({});
  };

  return (
    <div className="w-full flex flex-col space-y-6">
      <ProductActionsBar
        selectedRows={selectedRowData}
        resetRowSelection={resetRowSelection}
      />
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mr-auto">
              Filter By Category <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {categoryData.map((category) => {
              const isSelected =
                table.getColumn("category")?.getFilterValue() === category.name;

              return (
                <DropdownMenuItem
                  key={category.id}
                  onClick={() =>
                    table.getColumn("category")?.setFilterValue(category.name)
                  }
                  className={`flex justify-between items-center capitalize cursor-pointer hover:bg-gray-100 active:bg-gray-200 ${
                    isSelected ? "bg-gray-200 font-bold" : ""
                  }`}
                >
                  {category.name}
                  {isSelected && (
                    <CheckIcon className="ml-2 h-4 w-4 text-green-600" />
                  )}
                </DropdownMenuItem>
              );
            })}
            <div className="border-t my-1" />
            <DropdownMenuItem
              onClick={() => table.getColumn("category")?.setFilterValue("")}
              className="capitalize text-red-500 font-semibold cursor-pointer hover:bg-red-100 active:bg-red-200"
            >
              Reset Filter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Input
          placeholder="Search products..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-3xl w-full"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
