// src/pages/warehouse/cargo/CargoManagementPage.jsx

import { useNavigate } from "react-router-dom";
import CargoDataGrid from "../../components/CargoDataGrid";
import CargoTypeToggle from "./components/CargoTypeToggle";
import Card from "../../../style/components/Card";
import Button from "../../../style/components/Button";
import { FileText } from "lucide-react";
import CargoFilterPanel from "../../components/CargoFilterPanel";
import { useCargoManagementState } from "../../../controller/warehouse/useCargoManagementState";

function CargoManagementPage() {
  const navigate = useNavigate();
  const {
    cargos,
    tabCounts,
    totalCount,
    isLoading,
    error,
    cargoType,
    activeTab,
    filters,
    currentTabs,
    currentPage,
    totalPages,
    pageSize,
    handleRowClick,
    handleCargoTypeToggle,
    handleTabChange,
    handleFilterChange,
    handleSearch,
    handleReset,
    handlePageChange,
  } = useCargoManagementState();

  //구역 배지 클릭 → 화물 위치추적 페이지로 이동 + 컨테이너 번호 자동 검색
  const handleZoneClick = ({ containerId, positionArea }) => {
    navigate("/warehouse/dashboard", {
      state: {
        highlightWarehouseId: containerId,
        warehouseType: positionArea === "BONDED" ? "bonded" : "local",
      },
    });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-8 text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">데이터를 불러오는데 실패했습니다.</div>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen p-8">
      <Card>
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-gray-900">화물 관리 {cargoType === "import" ? "- 수입" : "- 수출"}</h1>
            <CargoTypeToggle cargoType={cargoType} onToggle={handleCargoTypeToggle} />
          </div>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex">
            {currentTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab.id ? "text-primary border-primary" : "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50"
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

        <div className="px-6 py-4">
          <CargoFilterPanel filters={filters} onFilterChange={handleFilterChange} onSearch={handleSearch} onReset={handleReset} hideCard={true} />
        </div>
      </Card>

      <div className="flex items-center gap-3 text-sm text-gray-600">
        <FileText className="h-4 w-4" />
        <span>
          총 <span className="font-semibold text-gray-900">{totalCount}</span>건의 화물 현황
        </span>
        <span className="text-gray-400 text-xs">· 구역 배지를 클릭하면 화물 위치추적 화면으로 이동합니다</span>
      </div>

      <CargoDataGrid
        cargos={cargos}
        isLoading={isLoading}
        error={error}
        onRowClicked={handleRowClick}
        onZoneClick={handleZoneClick}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default CargoManagementPage;
