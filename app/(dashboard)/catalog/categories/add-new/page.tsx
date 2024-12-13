import { CategoryForm } from "@/components/category-form";

const CategoryAddPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen  p-6">
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Add New Category
        </h1>
        <CategoryForm type="create" apiMutationUrl="/create/category" />
      </div>
    </div>
  );
};

export default CategoryAddPage;
