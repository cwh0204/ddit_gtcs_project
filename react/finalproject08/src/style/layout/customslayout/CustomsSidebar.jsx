import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils";
import { CUSTOMS_MENU_STRUCTURE } from "../../../constants/CustomsMenuStructure";

//src/style/layout/customslayout/CustomSidebar.jsx
function CustomsSidebar() {
  const location = useLocation();
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <aside className="relative flex flex-col w-64 h-full border-r border-[#123150] bg-[#0a2742] text-white overflow-y-auto shrink-0">
      <nav className="flex flex-col gap-1 pb-20">
        {/* 상단 타이틀 */}
        <p className="px-4 text-xs font-semibold text-gray-400 mb-2 mt-4">세관원 업무 시스템</p>

        {/* 메뉴 아이템들 */}
        {CUSTOMS_MENU_STRUCTURE.map((item, index) => {
          // 현재 경로가 이 메뉴에 속하는지 확인
          const isMainActive = location.pathname.startsWith(item.path);

          //서브메뉴가 없는 경우 (대시보드 등)
          if (!item.subItems || item.subItems.length === 0) {
            return (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors mx-2",
                  isMainActive ? "bg-[#123150] text-white font-bold shadow-sm" : "text-gray-300 hover:bg-[#123150] hover:text-white",
                )}
              >
                {item.name}
              </Link>
            );
          }

          // 2. 서브메뉴가 있는 경우
          const isOpen = openIndex === index;

          return (
            <div key={item.id} className="flex flex-col">
              {/* 상위 메뉴 버튼 */}
              <button
                onClick={() => handleToggle(index)}
                className={cn(
                  "flex items-center justify-between w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors select-none mx-2 max-w-[calc(100%-16px)]",
                  isMainActive ? "text-white font-bold" : "text-gray-300 hover:bg-[#123150] hover:text-white",
                )}
              >
                <span>{item.name}</span>
                <span className="flex items-center shrink-0">
                  {isOpen ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                </span>
              </button>

              {/* 서브메뉴 리스트 */}
              {isOpen && (
                <div className="flex flex-col gap-1 pl-4 mt-1 mb-2 border-l border-gray-600 ml-6">
                  {item.subItems.map((sub) => {
                    // 서브메뉴 전체 경로 생성
                    const fullPath = `${item.path}/${sub.path}`;
                    const isSubActive = location.pathname.includes(fullPath);

                    return (
                      <Link
                        key={sub.path}
                        to={fullPath}
                        className={cn(
                          "block rounded-md px-4 py-2 text-sm transition-colors",
                          isSubActive ? "bg-[#123150] text-blue-200 font-semibold" : "text-gray-400 hover:text-white hover:bg-[#123150]/50",
                        )}
                      >
                        {sub.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-0 w-full px-6 text-xs text-gray-400 bg-[#0a2742] pt-2 border-t border-[#123150]">
        <p>© 2026 G-TCS System</p>
        <p className="mt-1 opacity-70">세관원 모드</p>
      </div>
    </aside>
  );
}

export default CustomsSidebar;
