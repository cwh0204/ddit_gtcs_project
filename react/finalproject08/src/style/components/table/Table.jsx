import { cn } from "../../utils";

//src/style/components/table/Table.jsx
function Table({ className, children, ...props }) {
  return (
    <>
      <div className="w-full overflow-auto border border-gray-200 bg-white">
        <table className={cn("w-full caption-bottom text-sm text-left", className)} {...props}>
          {children}
        </table>
      </div>
    </>
  );
}

export default Table;
