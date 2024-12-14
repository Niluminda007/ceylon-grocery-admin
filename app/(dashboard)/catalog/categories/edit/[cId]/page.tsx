"use client";

import { fetcher } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";

import Loader from "@/components/loader";

import { CategoryExtended } from "@/types/category";
import { CategoryForm } from "@/components/category-form";

interface CategoryEditPage {
  params: {
    cId: string;
  };
}

const CategoryEditPage = ({ params }: CategoryEditPage) => {
  const categoryId = params.cId;

  const {
    data: category,
    isLoading,
    error,
  } = useQuery<CategoryExtended>({
    queryKey: ["category", categoryId],
    queryFn: () => fetcher({ url: "/fetch/category", params: { categoryId } }),
  });
  if (isLoading) {
    return <Loader />;
  }
  if (!isLoading && !category) {
    <div>Category cant be found</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen  p-6">
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg p-8">
        <CategoryForm
          category={category}
          type="update"
          apiMutationUrl="/update/category"
        />
      </div>
    </div>
  );
};

export default CategoryEditPage;
