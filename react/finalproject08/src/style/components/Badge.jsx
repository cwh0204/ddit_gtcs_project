import { cva } from "class-variance-authority";
import { cn } from "../utils";

//src/style/components/Badge.jsx
const badgeVariants = cva(
  /*tw*/ "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none border",
  {
    variants: {
      variant: {
        default: "bg-stone-700 text-white border-gray-200",
        primary: "bg-blue-700 text-white border-blue-200",
        success: "bg-green-700 text-white border-green-200", //승인, 완료, 수리
        warning: "bg-amber-500 text-white border-amber-200", //대기, 보완
        danger: "bg-red-700 text-white border-red-200", //반려, 차단, 오류
        outline: "text-gray-600 border-gray-300 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({ className, variant, children, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
}

export default Badge;
