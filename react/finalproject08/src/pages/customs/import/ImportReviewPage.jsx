// src/pages/customs/import/ImportReviewPage.jsx

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useImportListController } from "../../../controller/custom/import/useImportListController";
import DeclarationFilterPanel from "../../components/DeclarationFilterPanel";
import Card from "../../../style/components/Card";
import Button from "../../../style/components/Button";
import { FileText, RefreshCw, ChevronRight } from "lucide-react";
import ImportDataGrid from "../../components/ImportDataGrid";
import { IMPORT_REVIEW_TABS, STATUS_LABELS } from "../../../domain/customs/import/importConstants";

function ImportReviewPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [filters, setFilters] = useState({
    status: "",
    isUrgent: "",
    assignedOfficer: "",
    search: "",
    startDate: "",
    endDate: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({});

  // Tab 데이터 찾기
  const activeTabData = useMemo(() => {
    return IMPORT_REVIEW_TABS.find((tab) => tab.id === activeTab);
  }, [activeTab]);

  // mergedFilters 생성
  const mergedFilters = useMemo(() => {
    const tabFilter = activeTabData?.filter || {};
    return { ...tabFilter, ...appliedFilters };
  }, [activeTabData, appliedFilters]);

  const { declarations, totalCount, totalPages, statusCounts, isLoading, error, refetch } = useImportListController(
    mergedFilters,
    currentPage,
    pageSize,
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // ⭐ 탭 ID → statusCounts 키 매핑
  const TAB_STATUS_MAP = {
    all: null,
    waiting: "WAITING",
    reviewing: "REVIEWING",
    escalated: "ESCALATED",
    accepted: "ACCEPTED",
    physical: "PHYSICAL",
    supplement: "SUPPLEMENT",
    "payment-pending": "PAY_WAITING",
    "payment-completed": "PAY_COMPLETED",
    approved: "APPROVED",
    rejected: "REJECTED",
  };

  const getTabCount = (tabId) => {
    if (tabId === "all") return statusCounts?.total ?? 0;
    const statusKey = TAB_STATUS_MAP[tabId];
    return statusKey ? (statusCounts?.[statusKey] ?? 0) : 0;
  };

  // ⭐ 탭별 통계 표시 로직
  const displayStats = useMemo(() => {
    if (!statusCounts) return [];

    const stats = [];

    switch (activeTab) {
      case "all":
        stats.push({ label: "총", count: totalCount, showTotal: true });
        stats.push({ label: STATUS_LABELS.WAITING, count: statusCounts.WAITING || 0 });
        stats.push({ label: STATUS_LABELS.REVIEWING, count: statusCounts.REVIEWING || 0 });
        break;

      case "waiting":
        stats.push({ label: STATUS_LABELS.WAITING, count: statusCounts.WAITING || 0 });
        break;

      case "reviewing":
        stats.push({ label: STATUS_LABELS.REVIEWING, count: statusCounts.REVIEWING || 0 });
        break;

      case "escalated":
        stats.push({ label: STATUS_LABELS.ESCALATED || "결재요청", count: statusCounts.ESCALATED || 0 });
        break;

      case "accepted":
        stats.push({ label: STATUS_LABELS.ACCEPTED || "수리", count: statusCounts.ACCEPTED || 0 });
        break;

      case "physical":
        stats.push({ label: STATUS_LABELS.PHYSICAL, count: statusCounts.PHYSICAL || 0 });
        break;

      case "supplement":
        stats.push({ label: STATUS_LABELS.SUPPLEMENT, count: statusCounts.SUPPLEMENT || 0 });
        break;

      case "payment-pending":
        stats.push({
          label: STATUS_LABELS.PAY_WAITING || "납부 대기",
          count: statusCounts.PAY_WAITING || 0,
        });
        break;

      case "payment-completed":
        stats.push({
          label: STATUS_LABELS.PAY_COMPLETED || "납부 완료",
          count: statusCounts.PAY_COMPLETED || 0,
        });
        break;

      case "approved":
        stats.push({ label: STATUS_LABELS.APPROVED || "통관승인", count: statusCounts.APPROVED || 0 });
        break;

      case "rejected":
        stats.push({ label: STATUS_LABELS.REJECTED || "반려", count: statusCounts.REJECTED || 0 });
        break;

      default:
        stats.push({ label: "총", count: totalCount, showTotal: true });
        break;
    }

    return stats;
  }, [activeTab, statusCounts, totalCount]);

  // 필터 변경 핸들러
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 검색 실행
  const handleSearch = () => {
    const newFilters = {};

    if (filters.status) {
      newFilters.status = filters.status;
    }

    if (filters.isUrgent !== "") {
      newFilters.isUrgent = filters.isUrgent === "true";
    }

    if (filters.assignedOfficer) {
      newFilters.assignedOfficer = filters.assignedOfficer;
    }

    if (filters.search) {
      newFilters.search = filters.search;
    }

    if (filters.startDate) {
      newFilters.startDate = filters.startDate;
    }

    if (filters.endDate) {
      newFilters.endDate = filters.endDate;
    }

    setAppliedFilters(newFilters);
    setCurrentPage(1);
  };

  // 초기화
  const handleReset = () => {
    setFilters({
      status: "",
      isUrgent: "",
      assignedOfficer: "",
      search: "",
      startDate: "",
      endDate: "",
    });
    setAppliedFilters({});
    setCurrentPage(1);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    handleReset();
  };

  const onRowClicked = (event) => {
    const declarationId = event.data.declarationId;

    // activeTabData에서 isTaxTab 확인
    if (activeTabData?.isTaxTab) {
      navigate(`/customs/tax/detail/${declarationId}`);
    } else {
      navigate(`/customs/import/detail/${declarationId}`);
    }
  };

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
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="font-medium text-gray-900">수입 심사</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-600">{activeTabData?.label || "전체"}</span>
      </div>

      <Card>
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">수입심사</h1>
        </div>

        {/* Tab 네비게이션 */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {IMPORT_REVIEW_TABS.map((tab) => {
              const count = getTabCount(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-colors
                    ${activeTab === tab.id ? "text-primary border-primary " : "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50"}
                  `}
                >
                  {tab.label}
                  <span
                    className={`
                      min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold inline-flex items-center justify-center
                      ${activeTab === tab.id ? "bg-[#0f4c81] text-white" : "bg-gray-200 text-gray-600"}
                    `}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4">
          <DeclarationFilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onReset={handleReset}
            type="import"
            hideCard={true}
          />
        </div>
      </Card>

      {/* 탭별 통계 표시 */}
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <FileText className="h-4 w-4" />

        {displayStats.map((stat, index) => (
          <div key={index} className="flex items-center gap-3">
            {index > 0 && <span className="text-gray-400">·</span>}
            <span>
              {stat.showTotal ? (
                <span className="font-semibold text-gray-900">총 {stat.count}건</span>
              ) : (
                <>
                  {stat.label} <span className="font-semibold text-gray-900">{stat.count}</span>건
                </>
              )}
            </span>
          </div>
        ))}

        {/* 탭 설명 (옵션) */}
        {activeTabData?.description && (
          <>
            <span className="text-gray-400">·</span>
            <span>{activeTabData.description}</span>
          </>
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

export default ImportReviewPage;
