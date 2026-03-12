import { cn } from "../../utils";

//src/style/components/table/TableHeader
function TableHeader({ className, children, ...props }) {
  return (
    <>
      <thead className={cn("bg-gray-50 border-b border-gray-200", className)} {...props}>
        {children}
      </thead>
    </>
  );
}

export default TableHeader;
