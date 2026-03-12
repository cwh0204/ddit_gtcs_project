import { cva } from "class-variance-authority";
import { cn } from "../utils";

// src/style/components/Input.jsx
const inputVariants = cva(
  "h-9 w-full border border-gray-400 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600 focus:border-gray-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
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

function Input({ className, variant, type = "text", ...props }) {
  return <input type={type} className={cn(inputVariants({ variant }), className)} {...props} />;
}

export default Input;
