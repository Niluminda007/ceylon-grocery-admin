"use client";

import Loader from "@/components/loader";
import { fetcher } from "@/lib/fetcher";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { CategoryTable } from "./_components/category-table";

const CategoriesPage = () => {
  const { data, isLoading, error } = useQuery<Category[]>({
    queryKey: ["categories-all"],
    queryFn: () => fetcher({ url: "/fetch/categories" }),
  });
  if (isLoading) {
    return <Loader text="Loading categories..." />;
  }
  if (error) {
    return <div>Error loading categories. Please try again later.</div>;
  }
  if (data && data.length > 0) {
    return <CategoryTable categories={data} />;
  }
  return <div>No categories available.</div>;
};

export default CategoriesPage;
