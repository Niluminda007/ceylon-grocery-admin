"use client";

import Loader from "@/components/Loader";
import ProductTable from "@/components/ProductTable";
import { ProductType } from "@/types/productTypes";
import React, { useEffect, useState } from "react";

const ProductList = () => {
  const [products, setProducts] = useState<Array<ProductType> | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/fetch-all-products")
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data) {
          setProducts(data.data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col items-center mt-5 sm:mt-10">
      {isLoading ? <Loader /> : <ProductTable prodcuts={products} />}
    </div>
  );
};

export default ProductList;
