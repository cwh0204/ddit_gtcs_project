// src/pages/customs/import/ImportListPage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useImportListController } from "../../../controller/custom/import/useImportListController";
import Card from "../../../style/components/Card";
import Button from "../../../style/components/Button";
import Badge from "../../../style/components/Badge";
import { FileText, RefreshCw } from "lucide-react";
import ImportFilterPanel from "../../components/ImportFilterPanel";
import ImportDataGrid from "../../components/ImportDataGrid";
import { cn } from "../../../style/utils";

// ⭐ 탭 정의 (백엔드 상태 코드에 맞게 수정 필요)
const TABS = [
  { id: "all", label: "전체", status: null },
  { id: "pending", label: "심사대기", status: "SUBMITTED" },
  { id: "reviewing", label: "심사중", status: "REVIEWING" },
  { id: "accepted", label: "수리", status: "ACCEPTED" },
  { id: "inspection", label: "검사중", status: "PHYSICAL,INSPECTION,INSPECTION_COMPLETED" },
  { id: "supplement", label: "보완/정정", status: "SUPPLEMENT_REQUESTED,CORRECTION_REQUESTED" },
  { id: "pay_waiting", label: "납부대기", status: "PAY_WAITING" },
  { id: "pay_completed", label: "납부완료", status: "PAY_COMPLETED" },
  { id: "approved", label: "통관승인", status: "RELEASE_APPROVED,APPROVED" },
  { id: "cleared", label: "출고", status: "CLEARED,DELIVERED" },
];

function ImportListPage() {
  const navigate = useNavigate();

  // ⭐ 탭 상태
  const [activeTab, setActiveTab] = useState("all");

  // ⭐ 필터 상태 (status는 탭에서 제어)
  const [filters, setFilters] = useState({
    isUrgent: "",
    assignedOfficer: "",
    search: "",
    startDate: "",
    endDate: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { declarations, totalCount, totalPages, isLoading, error, refetch } = useImportListController(appliedFilters, currentPage, pageSize);

  // ⭐ 탭 변경 핸들러
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);

    const selectedTab = TABS.find((tab) => tab.id === tabId);
    const newAppliedFilters = {};

    // 탭의 status 적용
    if (selectedTab.status) {
      newAppliedFilters.status = selectedTab.status;
    }

    // 기존 필터 유지
    if (filters.isUrgent) newAppliedFilters.isUrgent = filters.isUrgent === "true";
    if (filters.assignedOfficer) newAppliedFilters.assignedOfficer = filters.assignedOfficer;
    if (filters.search) newAppliedFilters.search = filters.search;
    if (filters.startDate) newAppliedFilters.startDate = filters.startDate;
    if (filters.endDate) newAppliedFilters.endDate = filters.endDate;

    setAppliedFilters(newAppliedFilters);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearch = () => {
    const newAppliedFilters = {};

    // 현재 탭의 status 유지
    const currentTab = TABS.find((tab) => tab.id === activeTab);
    if (currentTab.status) {
      newAppliedFilters.status = currentTab.status;
    }

    // 추가 필터 적용
    if (filters.isUrgent) newAppliedFilters.isUrgent = filters.isUrgent === "true";
    if (filters.assignedOfficer) newAppliedFilters.assignedOfficer = filters.assignedOfficer;
    if (filters.search) newAppliedFilters.search = filters.search;
    if (filters.startDate) newAppliedFilters.startDate = filters.startDate;
    if (filters.endDate) newAppliedFilters.endDate = filters.endDate;

    setAppliedFilters(newAppliedFilters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({
      isUrgent: "",
      assignedOfficer: "",
      search: "",
      startDate: "",
      endDate: "",
    });

    // 현재 탭의 status만 유지
    const currentTab = TABS.find((tab) => tab.id === activeTab);
    const newAppliedFilters = {};
    if (currentTab.status) {
      newAppliedFilters.status = currentTab.status;
    }

    setAppliedFilters(newAppliedFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const onRowClicked = (event) => {
    const declarationId = event.data.declarationId;
    navigate(`detail/${declarationId}`);
  };

  // 필터가 적용되었는지 확인 (status 제외)
  const hasActiveFilters = Object.keys(appliedFilters).some((key) => key !== "status" && appliedFilters[key]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-8 text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">데이터를 불러오는데 실패했습니다.</div>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => refetch()}>다시 시도</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">수입신고 목록</h1>
          <p className="text-gray-600 mt-1">전체 수입신고서 조회 및 관리</p>
        </div>
      </div>

      {/* ⭐ 탭 네비게이션 */}
      <Card className="p-0 overflow-hidden">
        <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex-shrink-0 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
                activeTab === tab.id
                  ? "border-[#0f4c81] text-[#0f4c81] bg-blue-50"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* ⭐ 필터 패널 (상태 필터 숨김) */}
      <ImportFilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={handleReset}
        hideStatusFilter={true}
      />

      {/* 요약 정보 */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>
            총 <span className="font-semibold text-gray-900">{totalCount}</span>건
          </span>
          {totalPages > 1 && (
            <>
              <span className="text-gray-400">·</span>
              <span>
                <span className="font-semibold text-gray-900">{currentPage}</span> / {totalPages} 페이지
              </span>
            </>
          )}
        </div>
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <Badge variant="primary">필터 적용 중</Badge>
            <button onClick={handleReset} className="text-blue-600 hover:text-blue-800 font-medium">
              필터 제거
            </button>
          </div>
        )}
      </div>

      {/* 데이터 그리드 */}
      <ImportDataGrid
        declarations={declarations}
        isLoading={isLoading}
        onRowClicked={onRowClicked}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default ImportListPage;
