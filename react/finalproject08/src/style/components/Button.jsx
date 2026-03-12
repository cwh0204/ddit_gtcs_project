import { cva } from "class-variance-authority";
import { cn } from "../utils";

//src/style/components/Button.jsx
const buttonVariants = cva(
  /*tw*/ "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none ring-offset-white",
  {
    variants: {
      variant: {
        primary: "bg-[#0f4c81] text-white hover:bg-[#0a365c] shadow-sm",
        approval: "bg-[#08ca5f] text-white hover:bg-[#008d3d] shadow-sm",
        waiting: "bg-stone-500 text-white hover:bg-stone-700 shadow-sm",
        inspection: "bg-amber-500 text-white hover:bg-amber-700 shadow-sm",
        secondary: "bg-[#0a2742] text-white hover:bg-[#123150] shadow-sm",
        danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
        ghost: "hover:bg-gray-100 hover:text-gray-900 text-gray-600",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-8 text-lg",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

function Button({ className, variant, size, ...props }) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export default Button;
