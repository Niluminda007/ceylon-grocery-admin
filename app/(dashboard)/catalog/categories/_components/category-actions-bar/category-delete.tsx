import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fetcher } from "@/lib/fetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";

interface DeleteCategoryButtonProps {
  categoryIds: string[];
  resetRowSelection: () => void;
}

export const CategoryDelete = ({
  categoryIds,
  resetRowSelection,
}: DeleteCategoryButtonProps) => {
  const queryClient = useQueryClient();
  const {
    mutate: deleteMutation,
    isPending,
    error,
  } = useMutation<string>({
    mutationKey: ["delete-categories"],
    mutationFn: () =>
      fetcher({
        url: "/delete/categories",
        params: { ids: categoryIds.length ? categoryIds.join(",") : undefined },
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories-all"] });
      toast.success("successfully deleted categories");
      resetRowSelection();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    },
  });
  const handleDelete = () => {
    deleteMutation();
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <TooltipProvider>
          <Tooltip delayDuration={150}>
            <TooltipTrigger asChild>
              <div
                role="button"
                className={`${
                  isPending
                    ? "cursor-not-allowed opacity-40 bg-neutral-700"
                    : " opacity-100 cursor-pointer bg-red-500"
                }  p-2 rounded-md text-white ease-linear transition hover:bg-red-600`}
              >
                <FaTrash />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Category</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            Category from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
