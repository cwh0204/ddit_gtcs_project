import { cn } from "../../../../style/utils";

//src/pages/customs/import/components/TabSection.jsx
// ✅ 고정형 탭 레이아웃 (반응형 방지)

function TabSection({ tabs, activeTab, onTabChange, children }) {
  return (
    <div className="bg-white shadow-sm">
      {/* 탭 헤더 */}
      <div className="flex relative flex-nowrap overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "px-4 py-3 text-md font-semibold whitespace-nowrap relative z-10",
                "flex-shrink-0",
                "transition-colors",
                isActive ? "bg-[#0f4c81] text-white" : "bg-transparent text-gray-700 hover:bg-gray-50",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 탭 컨텐츠 */}
      <div className="p-6 border-t-2 border-[#0f4c81]">{children}</div>
    </div>
  );
}

export default TabSection;
