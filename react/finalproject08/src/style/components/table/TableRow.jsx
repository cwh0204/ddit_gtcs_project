import { cn } from "../../utils";

//src/style/components/table/TableRow.jsx
function TableRow({ className, children, ...props }) {
  return (
    <>
      <tr className={cn("border-b border-gray-100 transition-colors hover:bg-blue-50/50", className)} {...props}>
        {children}
      </tr>
    </>
  );
}

export default TableRow;
