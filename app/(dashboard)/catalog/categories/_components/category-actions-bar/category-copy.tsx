import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/fetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { FaCopy } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface CategoryCopyProps {
  categoryIds: string[];
}

export const CategoryCopy = ({ categoryIds }: CategoryCopyProps) => {
  const queryClient = useQueryClient();
  const {
    mutate: duplicateMutation,
    isPending,
    error,
  } = useMutation<string>({
    mutationKey: ["duplicate-category"],
    mutationFn: () =>
      fetcher({
        url: "/create/categories",
        data: { categoryIds },
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories-all"] });
      toast.success(`Categories duplicated successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  const handleDuplicate = () => {
    duplicateMutation();
  };
  return (
    <TooltipProvider>
      <Tooltip delayDuration={150}>
        <TooltipTrigger>
          <Button
            asChild
            variant={"outline"}
            size={"icon"}
            onClick={handleDuplicate}
            className="px-2"
          >
            <FaCopy color="#707070" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Duplicate Category</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
