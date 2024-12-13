import { ProductForm } from "@/components/product-form";
const ProductAddPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen  p-6">
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Add New Product</h1>
        <ProductForm type="create" apiMutationUrl="/create/product" />
      </div>
    </div>
  );
};

export default ProductAddPage;
