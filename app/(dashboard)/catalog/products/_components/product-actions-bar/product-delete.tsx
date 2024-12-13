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
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/fetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";

interface DeleteProductButtonProps {
  productIds: string[];
  resetRowSelection: () => void;
}

export const ProductDelete = ({
  productIds,
  resetRowSelection,
}: DeleteProductButtonProps) => {
  const queryClient = useQueryClient();
  const {
    mutate: deleteMutation,
    isPending,
    error,
  } = useMutation<string>({
    mutationKey: ["delete-products"],
    mutationFn: () =>
      fetcher({
        url: "/delete/products",
        params: { ids: productIds.length ? productIds.join(",") : undefined },
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-all"] });
      toast.success("successfully deleted products");
      resetRowSelection();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  const handleDelete = () => {
    console.log("hello");
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
              <p>Delete Product</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            product from the database.
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
