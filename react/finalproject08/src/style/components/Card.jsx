import { cva } from "class-variance-authority";
import { cn } from "../utils";

//src/style/components/Card.jsx
const cardVariants = cva(/*tw*/ "bg-white rounded-xl border border-gray-200 shadow-sm text-gray-950 overflow-hidden", {
  variants: {
    padding: {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    padding: "md",
  },
});

function Card({ className, children, padding, ...props }) {
  return (
    <>
      {/* 1. 카드전체 틀 */}
      <div className={cn(cardVariants({ padding }), className)} {...props}>
        {children}
      </div>
    </>
  );
}

export default Card;
