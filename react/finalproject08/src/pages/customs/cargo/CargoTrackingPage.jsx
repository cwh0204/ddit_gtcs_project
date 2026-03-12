import { useMemo } from "react";
import Card from "../../../style/components/Card";
import { FileText, ChevronRight } from "lucide-react";
import CargoDataGrid from "../../components/CargoDataGrid";
import DeclarationFilterPanel from "../../components/DeclarationFilterPanel";
import { useCargoTrackingController } from "../../../controller/custom/cargo/useCargoTrackingController";

// src/pages/customs/cargo/CargoTrackingPage.jsx

/**
 * 화물 진행 현황 페이지 (세관원)
 * ✅ 수입/수출 토글
 * ✅ 탭: 보세구역 | 검사목록 | 검사완료 | 반출승인 | 반출차단 | 국내구역 | 통관완료
 * ✅ API 연결 완료
 */

function CargoTrackingPage() {
  const {
    // 데이터
    cargos,
    tabCounts,
    totalCount,
    statusStats,
    isLoading,
    error,

    // 페이징
    currentPage,
    totalPages,
    pageSize,

    // 상태
    cargoType,
    activeTab,
    filters,
    currentTabs,

    // 핸들러
    handleRowClick,
    handleCargoTypeToggle,
    handleTabChange,
    handleFilterChange,
    handleSearch,
    handleReset,
    handlePageChange,
  } = useCargoTrackingController();

  // 현재 활성 탭 정보
  const activeTabData = useMemo(() => {
    return currentTabs.find((tab) => tab.id === activeTab);
  }, [currentTabs, activeTab]);

  // 에러 처리
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-8 text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">데이터를 불러오는데 실패했습니다.</div>
          <p className="text-gray-600 mb-4">{error.message}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="font-medium text-gray-900">화물 진행 현황</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-600">
          {cargoType === "import" ? "수입" : "수출"} · {activeTabData?.label || "보세구역"}
        </span>
      </div>

      <Card>
        {/* 헤더 + 수입/수출 토글 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">화물 진행 현황</h1>

            <div className="inline-flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleCargoTypeToggle("import")}
                className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                  cargoType === "import" ? "bg-[#0f4c81] text-white shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                수입 화물
              </button>
              <button
                onClick={() => handleCargoTypeToggle("export")}
                className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                  cargoType === "export" ? "bg-[#0f4c81] text-white shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                수출 화물
              </button>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {currentTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab.id ? "text-[#0f4c81] border-[#0f4c81]" : "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tabCounts[tab.id] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 필터 패널 */}
        <div className="p-4">
          <DeclarationFilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onReset={handleReset}
            type="cargo"
            hideCard={true}
          />
        </div>
      </Card>

      {/* 통계 */}
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <FileText className="h-4 w-4" />
        <span>
          총 <span className="font-semibold text-gray-900">{totalCount}</span>건
        </span>

        {Object.entries(statusStats).map(([status, count]) => (
          <div key={status} className="flex items-center gap-3">
            <span className="text-gray-400">·</span>
            <span>
              {status} <span className="font-semibold text-gray-900">{count}</span>건
            </span>
          </div>
        ))}
      </div>

      {/* 데이터 그리드 */}
      <CargoDataGrid
        cargos={cargos}
        isLoading={isLoading}
        onRowClicked={handleRowClick}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default CargoTrackingPage;
