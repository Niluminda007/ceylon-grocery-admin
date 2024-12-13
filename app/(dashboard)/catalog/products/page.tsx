"use client";

import Loader from "@/components/loader";
import { fetcher } from "@/lib/fetcher";
import { Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ProductsTable } from "./_components/product-table";

const ProductPage = () => {
  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ["products-all"],
    queryFn: () => fetcher({ url: "/fetch/products" }),
  });

  if (isLoading) {
    return <Loader text="Loading products..." />;
  }

  if (error) {
    return (
      <div className="text-red-600">
        Error loading products. Please try again later.
      </div>
    );
  }

  if (data && data.length > 0) {
    return (
      <div className="flex flex-col space-y-4 relative p-4 border border-gray-300 rounded-md">
        <ProductsTable products={data} />
      </div>
    );
  }

  return <div>No products available.</div>;
};

export default ProductPage;
