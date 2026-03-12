// src/pages/warehouse/cargo/components/CargoTypeToggle.jsx

/**
 * 화물 타입 토글 컴포넌트 (화이트 테마)
 * ✅ 수입/수출과 동일한 스타일
 * ✅ 수입 ↔ 수출 전환
 */

function CargoTypeToggle({ cargoType, onToggle }) {
  return (
    <div className="flex items-center gap-3">
      {/* 토글 버튼 */}
      <div className="inline-flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => onToggle("import")}
          className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
            cargoType === "import" ? "bg-[#0f4c81] text-white shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          수입 화물
        </button>
        <button
          onClick={() => onToggle("export")}
          className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
            cargoType === "export" ? "bg-[#0f4c81] text-white shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          수출 화물
        </button>
      </div>
    </div>
  );
}

export default CargoTypeToggle;
