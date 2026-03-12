import { memo } from "react";

// src/style/layout/warehouselayout/components/WarehouseTypeToggle.jsx

/**
 * 창고 타입 토글 버튼 (보세 | 국내)
 * - 화면 중앙 상단에 위치
 * - 보세구역과 국내창고 전환
 */
const WarehouseTypeToggle = memo(({ warehouseType, onToggle }) => {
  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex bg-black/40 backdrop-blur-md rounded-lg border border-white/10 p-1">
        <button
          onClick={() => onToggle("bonded")}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
            warehouseType === "bonded" ? "bg-green-500 text-white shadow-md shadow-blue-500/25" : "text-gray-300 hover:text-white hover:bg-white/10"
          }`}
        >
          보세구역
        </button>
        <button
          onClick={() => onToggle("domestic")}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
            warehouseType === "domestic"
              ? "bg-green-500 text-white shadow-md shadow-green-500/25"
              : "text-gray-300 hover:text-white hover:bg-white/10"
          }`}
        >
          국내창고
        </button>
      </div>
    </div>
  );
});

WarehouseTypeToggle.displayName = "WarehouseTypeToggle";

export default WarehouseTypeToggle;
