"use client";

import Loader from "@/components/loader";
import { fetcher } from "@/lib/fetcher";
import { Category, Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ProductsTable } from "./_components/product-table";
import { ExtendedProduct } from "@/types/product";

const ProductPage = () => {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery<ExtendedProduct[]>({
    queryKey: ["products-all"],
    queryFn: () => fetcher({ url: "/fetch/products" }),
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories-all"],
    queryFn: () => fetcher({ url: "/fetch/categories" }),
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

  if (products && products.length > 0) {
    return (
      <div className="flex flex-col space-y-4 relative p-4 border border-gray-300 rounded-md">
        <ProductsTable products={products} categories={categories || []} />
      </div>
    );
  }

  return <div>No products available.</div>;
};

export default ProductPage;
