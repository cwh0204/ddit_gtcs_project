import { cva } from "class-variance-authority";
import { cn } from "../../utils";
import { ChevronDown } from "lucide-react";

// src/style/components/form/Select.jsx
const selectVariants = cva(
  "h-9 w-full border border-gray-400 bg-white pl-3 pr-8 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-600 focus:border-gray-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 appearance-none cursor-pointer",
  {
    variants: {
      variant: {
        default: "",
        error: "border-red-500 focus:ring-red-500 focus:border-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Select({ className, variant, children, ...props }) {
  return (
    <div className="relative">
      <select className={cn(selectVariants({ variant }), className)} {...props}>
        {children}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
    </div>
  );
}

export default Select;
