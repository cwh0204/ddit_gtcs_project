import { cva } from "class-variance-authority";
import { cn } from "../../utils";

//src/style/components/form/Label.jsx
const labelVariants = cva("text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block", {
  variants: {
    required: {
      true: "after:content-['*'] after:ml-0.5 after:text-red-500",
      false: "",
    },
  },
  defaultVariants: {
    required: false,
  },
});

function Label({ className, required, children, ...props }) {
  return (
    <>
      <label className={cn(labelVariants({ required }), className)} {...props}>
        {children}
      </label>
    </>
  );
}

export default Label;
