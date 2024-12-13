"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Textarea } from "@/components/ui/textarea";
import { Category, Product } from "@prisma/client";
import { useRef, useEffect } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { decimalToNumber, fileToBase64 } from "@/lib/utils";
import { CldImage } from "next-cloudinary";
import { ProductSchema } from "@/schemas/product-schema";

interface ProductFormProps {
  type: "create" | "update";
  product?: Product;
  apiMutationUrl: string;
}

export const ProductForm = ({
  type,
  product,
  apiMutationUrl,
}: ProductFormProps) => {
  let defaultValues: z.infer<typeof ProductSchema> = {
    name: "",
    price: 0,
    salePrice: -1,
    description: "",
    weight: "0g",
    stockCount: 0,
    category: "",
    images: [],
    tags: [],
  };
  if (type === "update" && product) {
    defaultValues = {
      id: product.id,
      name: product.name,
      price: decimalToNumber(product.price),
      salePrice: product.salePrice ? decimalToNumber(product.salePrice) : -1,
      description: product.description,
      weight: product.weight ? product.weight : "0g",
      stockCount: product.stockCount,
      category: product.category_id,
      images: [],
      tags: product.tags,
    };
  }

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues,
  });
  const router = useRouter();
  const {
    formState: { isDirty },
  } = form;

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [image, setImage] = useState<string | undefined>(
    product ? product.images[0] : undefined
  );

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetcher({ url: "/fetch/categories" }),
  });

  const queryClient = useQueryClient();

  const { mutate: productMutation, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof ProductSchema>) =>
      fetcher({ url: `${apiMutationUrl}`, data: values, method: "POST" }),
    onSuccess: (data: any) => {
      const successMessage =
        type === "create"
          ? "Product created successfully"
          : "Product updated successfully";
      setSuccess(successMessage);
      setTimeout(() => setSuccess(undefined), 3000);
      queryClient.invalidateQueries({ queryKey: ["products-all"] });
      queryClient.invalidateQueries({ queryKey: ["product", product?.id] });
      form.reset();
      router.back();
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const base64Image = await fileToBase64(files[0]);
      if (base64Image) {
        setImage(base64Image as string);
        form.setValue("images", [base64Image], { shouldDirty: true });
      }
    }
  };

  const onSubmit = (values: z.infer<typeof ProductSchema>) => {
    productMutation(values);
  };

  const productButtonText =
    type === "create" ? "Add Product" : "Update Product";
  const productButtonPendingText =
    type === "create" ? "...adding" : "...updating";
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* First Column */}
        <div className="space-y-6">
          {/* Product Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Product Name
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder="Product Name"
                    type="text"
                    autoComplete="off"
                    className="rounded-md p-3 border focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Product Price
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder="Product Price"
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    type="number"
                    autoComplete="off"
                    className="rounded-md p-3 border focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sale Price */}
          <FormField
            control={form.control}
            name="salePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Sale Price
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    placeholder="Sale Price"
                    type="number"
                    autoComplete="off"
                    className="rounded-md p-3 border focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stock Count */}
          <FormField
            control={form.control}
            name="stockCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Stock Count
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder="Stock Count"
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    type="number"
                    autoComplete="off"
                    className="rounded-md p-3 border focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Second Column */}
        <div className="space-y-6">
          {/* Product Weight */}
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Product Weight
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder="Product Weight (e.g., 1kg, 500g)"
                    type="text"
                    autoComplete="off"
                    className="rounded-md p-3 border focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Product Category */}

          {categories && categories.length > 0 && (
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => {
                const buttonRef = useRef<HTMLDivElement>(null);
                const [dropdownWidth, setDropdownWidth] = useState("auto");
                const selectedCategory = categories.find(
                  (category) => category.id === field.value
                );
                useEffect(() => {
                  if (buttonRef.current) {
                    setDropdownWidth(`${buttonRef.current.offsetWidth}px`);
                  }
                }, []);

                return (
                  <FormItem className="flex flex-col justify-between relative">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <div
                            ref={buttonRef}
                            role="button"
                            className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 flex items-center justify-between"
                          >
                            {selectedCategory?.name || "Select a Category"}
                            <ChevronDown className="ml-2" />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          style={{ width: dropdownWidth }}
                          className="mt-1"
                        >
                          <DropdownMenuLabel>
                            Select a Category
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {categories.map((category, index) => (
                            <DropdownMenuItem
                              key={index}
                              onSelect={() => field.onChange(category.id)}
                              className="cursor-pointer"
                            >
                              <div className="w-full flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-700">
                                  {category.name}
                                </span>
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.category?.message}
                    </FormMessage>
                  </FormItem>
                );
              }}
            />
          )}

          {/* Product Tags */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Product Tags
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder="Product Tags (comma separated)"
                    type="text"
                    autoComplete="off"
                    onChange={(e) => {
                      const tagsArray = e.target.value
                        .split(",")
                        .map((tag) => tag.trim());
                      field.onChange(tagsArray);
                    }}
                    className="rounded-md p-3 border focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Product Description (Spanning two columns) */}
        <div className="md:col-span-2 space-y-6">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Product Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isPending}
                    {...field}
                    placeholder="Product Description"
                    className="border rounded-md p-3 w-full"
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Image Section */}
        <div className="col-span-1 md:col-span-2 flex justify-center mb-6">
          <div className="flex flex-col items-center space-y-2">
            <h3 className="text-lg font-medium text-neutral-900">
              Product Image
            </h3>

            <div className="relative w-32 h-32 rounded-full border border-gray-300 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {image ? (
                <CldImage
                  alt="default-product-image"
                  className="w-[128px] h-[128px]"
                  height={128}
                  width={128}
                  src={image}
                />
              ) : (
                <CldImage
                  alt="default-product-image"
                  className="w-[128px] h-[128px]"
                  height={128}
                  width={128}
                  src="ceylon-grocery/products/default_product_image/default-product.png"
                />
              )}
            </div>
          </div>
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />

        {/* Submit Button */}
        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            disabled={isPending || !isDirty}
            className={`${
              !isDirty ? "opacity-60 " : "opacity-100 "
            } w-full py-3 bg-gradient-to-r from-neutral-700 to-neutral-900 text-white rounded-md   text-lg font-semibold shadow-lg `}
          >
            {isPending ? productButtonPendingText : productButtonText}
          </button>
        </div>
      </form>
    </Form>
  );
};
