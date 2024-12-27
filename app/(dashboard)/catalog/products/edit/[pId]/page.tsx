"use client";

import { fetcher } from "@/lib/fetcher";
import { Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import Loader from "@/components/loader";

import { ProductForm } from "@/components/product-form";

interface ProductEditPageProps {
  params: {
    pId: string;
  };
}

const ProductEditPage = ({ params }: ProductEditPageProps) => {
  const productId = params.pId;

  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => fetcher({ url: "/fetch/product", params: { productId } }),
    staleTime: 0,
  });
  if (isLoading) {
    return <Loader />;
  }
  if (!isLoading && !product) {
    <div>Product counlt be found</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen  p-6">
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Product</h1>

        <ProductForm
          type="update"
          apiMutationUrl="/update/product"
          product={product}
        />
      </div>
    </div>
  );
};

export default ProductEditPage;
