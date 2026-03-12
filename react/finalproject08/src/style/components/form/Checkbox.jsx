import { cva } from "class-variance-authority";
import { cn } from "../../utils";

//src/style/components/form/CHeckbox.jsx
const checkboxVariants = cva(
  "peer h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 accent-[#0f4c81] ",
  {
    variants: {},
  },
);

function Checkbox({ className, id, label, ...props }) {
  return (
    <>
      <div className="flex items-center space-x-2">
        <input type="checkbox" id={id} className={cn(checkboxVariants(), className)} {...props} />
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    </>
  );
}

export default Checkbox;
