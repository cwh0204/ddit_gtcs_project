import { cn } from "../../utils";

//src/style/components/table/TableHead.jsx
function TableHead({ className, children, ...props }) {
  return (
    <>
      <th className={cn("h-12 px-4 text-left align-middle font-semibold text-gray-600", className)} {...props}>
        {children}
      </th>
    </>
  );
}

export default TableHead;
