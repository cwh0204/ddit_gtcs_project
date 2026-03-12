//사용하진 않지만, 참고용으로 가지고 있으면 된다.

import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils";
import { MENU_STRUCTURE } from "../../../constants/sidebar/menuData";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

function Sidebar({ className }) {
  const location = useLocation();
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <aside className={cn("relative  flex-col w-64 h-full border-r border-[#123150] bg-[#0a2742] text-white overflow-y-auto shrink-0", className)}>
      <nav className="flex flex-col gap-1 pb-20">
        <p className="px-4 text-xs font-semibold text-gray-400 mb-2 mt-4">Customs Audit System</p>

        {MENU_STRUCTURE.map((item, index) => {
          const isMainActive =
            item.path === "" ? location.pathname === "/" || location.pathname.endsWith("/") : location.pathname.split("/").includes(item.path);

          // 1. 서브메뉴가 없는 경우
          if (!item.subItems) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors mx-2",
                  //활성화: 밝은 곤색(#123150) + 흰색 텍스트 / 비활성: 회색 텍스트 + 호버 시 밝은 곤색
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
            <div key={item.path} className="flex flex-col">
              <button
                onClick={() => handleToggle(index)}
                className={cn(
                  "flex items-center justify-between w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors select-none mx-2 max-w-[calc(100%-16px)]",
                  // 텍스트 및 호버 색상 변경
                  isMainActive ? "text-white font-bold" : "text-gray-300 hover:bg-[#123150] hover:text-white",
                )}
              >
                <span>{item.name}</span>
                {isOpen ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
              </button>

              {isOpen && (
                <div className="flex flex-col gap-1 pl-4 mt-1 mb-2 border-l border-gray-600 ml-6">
                  {item.subItems.map((sub) => {
                    const fullPath = item.path === "" ? sub.path : `${item.path}/${sub.path}`;
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

      {/* 하단 푸터 영역 색상 변경 */}
      <div className="absolute bottom-4 left-0 w-full px-6 text-xs text-gray-400 bg-[#0a2742] pt-2 border-t border-[#123150]">
        <p>© 2026 G-TCS System</p>
        <p className="mt-1 opacity-70">Customs Officer Mode</p>
      </div>
    </aside>
  );
}

export default Sidebar;
