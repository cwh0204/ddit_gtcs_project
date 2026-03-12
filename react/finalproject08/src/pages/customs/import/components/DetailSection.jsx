import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../../../style/utils";

/**
 * DetailSection - 접기/펼치기 가능한 섹션 래퍼
 *
 * @param {string} title - 섹션 제목
 * @param {boolean} isOpen - 열림/닫힘 상태
 * @param {function} onToggle - 토글 핸들러
 * @param {React.ReactNode} children - 섹션 내용
 */

//src/pages/customs/import/components/DetailSection.jsx
function DetailSection({ title, isOpen, onToggle, children }) {
  return (
    <>
      <div className="bg-white border border-gray-200  overflow-hidden">
        <button
          onClick={onToggle}
          className={cn(
            "w-full flex items-center justify-between px-6 py-4",
            "bg-[#f1f4f8] hover:bg-[#e2e6ea] transition-colors",
            "border-l-4 border-[#0f4c81]",
          )}
        >
          <h3 className="text-lg font-bold text-[#0f4c81]">{title}</h3>
          {isOpen ? <ChevronUp className="h-5 w-5 text-gray-600" /> : <ChevronDown className="h-5 w-5 text-gray-600" />}
        </button>
        {/* 섹션의 내용 */}
        {isOpen && <div className="p-6">{children}</div>}
      </div>
    </>
  );
}

export default DetailSection;
