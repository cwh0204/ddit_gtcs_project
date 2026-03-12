import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "../utils";

//src/style/components/Modal.jsx
const modalVariants = cva(
  /*tw*/ "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-[95vw] h-[90vh]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

function Modal({ isOpen, onClose, size, title, children, className, ...props }) {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className={cn(modalVariants({ size }), className)} {...props}>
        <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
          {title && <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </>
  );
}

export default Modal;
