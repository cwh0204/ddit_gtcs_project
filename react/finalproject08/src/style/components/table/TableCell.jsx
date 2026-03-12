import { cn } from "../../utils";

//src/style/components/table/TableCell.jsx
function TableCell({ className, children, ...props }) {
  return (
    <>
      <td className={cn("p-4 align-middle text-gray-700", className)} {...props}>
        {children}
      </td>
    </>
  );
}

export default TableCell;
