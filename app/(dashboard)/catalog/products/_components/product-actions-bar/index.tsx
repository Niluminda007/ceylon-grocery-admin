import { ProductTD } from "../product-table/columns";
import { ProductAdd } from "./product-add";
import { ProductCopy } from "./product-copy";
import { ProductDelete } from "./product-delete";

interface ProductActionsBarProps {
  selectedRows: ProductTD[];
  resetRowSelection: () => void;
}

export const ProductActionsBar = ({
  selectedRows,
  resetRowSelection,
}: ProductActionsBarProps) => {
  const selectedProductIds = selectedRows?.map((row) => row.id) || [];
  return (
    <div className="ml-auto flex gap-x-4">
      <ProductAdd />
      <ProductCopy productIds={selectedProductIds} />
      <ProductDelete
        productIds={selectedProductIds}
        resetRowSelection={resetRowSelection}
      />
    </div>
  );
};
