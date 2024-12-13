"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { toast } from "sonner";
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

import { fileToBase64 } from "@/lib/utils";
import { CldImage } from "next-cloudinary";
import { CategorySchema } from "@/schemas/category-schema";
import { CategoryExtended } from "@/types/category";
import { useRouter } from "next/navigation";

interface CategoryFormProps {
  type: "create" | "update";
  category?: CategoryExtended;
  apiMutationUrl: string;
}

export const CategoryForm = ({
  type,
  category,
  apiMutationUrl,
}: CategoryFormProps) => {
  let defaultValues: z.infer<typeof CategorySchema> = {
    name: "",
    description: "",
    images: [],
    parentCategory: [],
    subCategory: [],
  };
  if (type === "update" && category) {
    defaultValues = {
      id: category.id,
      name: category.name,
      description: category.description,
      parentCategory: [],
      subCategory: [],
      images: [],
    };
  }

  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues,
  });
  const {
    formState: { isDirty },
  } = form;

  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [image, setImage] = useState<string | undefined>(
    category ? category.images[0] : undefined
  );
  const queryClient = useQueryClient();

  const { mutate: categorytMutation, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof CategorySchema>) =>
      fetcher({ url: `${apiMutationUrl}`, data: values, method: "PUT" }),
    onSuccess: (data: any) => {
      const successMessage =
        type === "create"
          ? "Category created successfully"
          : "Category updated successfully";
      setSuccess(successMessage);
      setTimeout(() => setSuccess(undefined), 3000);
      queryClient.invalidateQueries({ queryKey: ["categories-all"] });
      queryClient.invalidateQueries({ queryKey: ["category", category?.id] });
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

  const onSubmit = (values: z.infer<typeof CategorySchema>) => {
    categorytMutation(values);
  };

  const categoryButtonText =
    type === "create" ? "Add Category" : "Update Category";
  const categoryButtonPendingText =
    type === "create" ? "...adding" : "...updating";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full grid grid-cols-1"
      >
        {/* First Column */}
        <div className="space-y-6">
          {/* Category Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Category Name
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder="Category Name"
                    type="text"
                    autoComplete="off"
                    className="rounded-md p-3 border focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    Category Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isPending}
                      {...field}
                      placeholder="Category Description"
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
                Category Image
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
                    alt="category-image"
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
                    src="ceylon-grocery/default/default-image.png"
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
              {isPending ? categoryButtonPendingText : categoryButtonText}
            </button>
          </div>
        </div>
      </form>
    </Form>
  );
};
