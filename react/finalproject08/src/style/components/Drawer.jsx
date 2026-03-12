import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "../utils";

// src/style/components/Drawer.jsx

const drawerVariants = cva(/*tw*/ "fixed z-50 bg-white p-6 shadow-xl inset-y-0 right-0 h-full border-l flex flex-col", {
  variants: {
    size: {
      sm: "w-[300px]",
      md: "w-[400px]",
      lg: "w-[600px]",
      xl: "w-[min(1080px,68vw)]",
      full: "w-[min(1280px,80vw)]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

/**
 * Drawer 컴포넌트
 *
 * isOpen prop만으로 CSS transition 제어
 * - isOpen=true  → translate-x-0    (슬라이드 IN)
 * - isOpen=false → translate-x-full (슬라이드 OUT)
 *
 * DOM 제거 없이 항상 마운트 유지 → 트랜지션이 자연스럽게 동작
 * 오버레이도 opacity transition으로 페이드 처리
 * pointer-events로 닫힌 상태에서 클릭 차단
 */
function Drawer({ isOpen, onClose, size, title, children, className, ...props }) {
  return (
    <>
      {/* 오버레이 - 항상 마운트, opacity로 페이드 in/out */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* 드로어 패널 - 항상 마운트, translate로 슬라이드 in/out */}
      <div
        className={cn(
          drawerVariants({ size }),
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
          className,
        )}
        {...props}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 transition-colors focus:ring-2 focus:ring-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto pr-1">{children}</div>
      </div>
    </>
  );
}

export default Drawer;
