import { CategoryTD } from "../category-table/columns";
import { CategoryAdd } from "./category-add";
import { CategoryCopy } from "./category-copy";
import { CategoryDelete } from "./category-delete";

interface CategoryActionsBarProps {
  selectedRows: CategoryTD[];
  resetRowSelection: () => void;
}

export const CategoryActionsBar = ({
  selectedRows,
  resetRowSelection,
}: CategoryActionsBarProps) => {
  const selectedCategoryIds = selectedRows?.map((row) => row.id) || [];
  return (
    <div className="ml-auto flex gap-x-4">
      <CategoryAdd />
      <CategoryCopy categoryIds={selectedCategoryIds} />
      <CategoryDelete
        categoryIds={selectedCategoryIds}
        resetRowSelection={resetRowSelection}
      />
    </div>
  );
};
