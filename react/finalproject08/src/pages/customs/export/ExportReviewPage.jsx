// src/pages/customs/export/ExportReviewPage.jsx

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useExportListController } from "../../../controller/custom/export/useExportListController";
import Card from "../../../style/components/Card";
import Button from "../../../style/components/Button";
import Select from "../../../style/components/form/Select";
import Input from "../../../style/components/Input";
import { FileText, RefreshCw, Search, ChevronRight } from "lucide-react";
import ExportDataGrid from "../../components/ExportDataGrid";
import { FILTERABLE_STATUSES, URGENT_OPTIONS, EXPORT_REVIEW_TABS, STATUS_LABELS } from "../../../domain/customs/export/exportConstants";

function ExportReviewPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [localFilters, setLocalFilters] = useState({
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
    return EXPORT_REVIEW_TABS.find((tab) => tab.id === activeTab);
  }, [activeTab]);

  // mergedFilters 생성
  const mergedFilters = useMemo(() => {
    const tabFilter = activeTabData?.filter || {};
    return { ...tabFilter, ...appliedFilters };
  }, [activeTabData, appliedFilters]);

  const { declarations, totalCount, totalPages, statusCounts, isLoading, error, refetch } = useExportListController(
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
    accepted: "ACCEPTED",
    physical: "PHYSICAL",
    supplement: "SUPPLEMENT",
    approved: "APPROVED",
    rejected: "REJECTED",
  };

  const getTabCount = (tabId) => {
    if (tabId === "all") return statusCounts?.total ?? 0;
    const statusKey = TAB_STATUS_MAP[tabId];
    return statusKey ? (statusCounts?.[statusKey] ?? 0) : 0;
  };

  // ⭐ 탭별 통계 표시 로직 (수정됨)
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

      case "accepted":
        stats.push({ label: STATUS_LABELS.ACCEPTED || "수리", count: statusCounts.ACCEPTED || 0 });
        break;

      case "physical":
        stats.push({ label: STATUS_LABELS.PHYSICAL, count: statusCounts.PHYSICAL || 0 });
        break;

      case "supplement":
        stats.push({ label: STATUS_LABELS.SUPPLEMENT, count: statusCounts.SUPPLEMENT || 0 });
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

  const handleLocalChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const newFilters = {};

    if (localFilters.status) newFilters.status = localFilters.status;
    if (localFilters.isUrgent !== "") newFilters.isUrgent = localFilters.isUrgent === "true";
    if (localFilters.assignedOfficer) newFilters.assignedOfficer = localFilters.assignedOfficer;
    if (localFilters.search) newFilters.search = localFilters.search;
    if (localFilters.startDate) newFilters.startDate = localFilters.startDate;
    if (localFilters.endDate) newFilters.endDate = localFilters.endDate;

    setAppliedFilters(newFilters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setLocalFilters({
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    handleReset();
  };

  const onRowClicked = (event) => {
    const declarationId = event.data.declarationId;
    navigate(`/customs/export/detail/${declarationId}`);
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
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="font-medium text-gray-900">수출 심사</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-600">{activeTabData?.label || "전체"}</span>
      </div>

      <Card>
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">수출심사</h1>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex">
            {EXPORT_REVIEW_TABS.map((tab) => {
              const count = getTabCount(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-colors
                    ${
                      activeTab === tab.id
                        ? "text-[#0f4c81] border-[#0f4c81] "
                        : "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50"
                    }
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">상태 :</label>
              <Select value={localFilters.status} onChange={(e) => handleLocalChange("status", e.target.value)} className="w-[110px]">
                <option value="">전체</option>
                {FILTERABLE_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">긴급 :</label>
              <Select value={localFilters.isUrgent} onChange={(e) => handleLocalChange("isUrgent", e.target.value)} className="w-20">
                {URGENT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">신고일자 :</label>
              <div className="flex items-center gap-1">
                <Input
                  type="date"
                  value={localFilters.startDate}
                  onChange={(e) => handleLocalChange("startDate", e.target.value)}
                  className="w-[130px]"
                  max={localFilters.endDate}
                />
                <span className="text-gray-500">~</span>
                <Input
                  type="date"
                  value={localFilters.endDate}
                  onChange={(e) => handleLocalChange("endDate", e.target.value)}
                  className="w-[130px]"
                  min={localFilters.startDate}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">검색 :</label>
              <Input
                type="text"
                placeholder="신고번호 또는 업체명"
                value={localFilters.search}
                onChange={(e) => handleLocalChange("search", e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-[300px]"
              />
            </div>

            <div className="flex gap-2 min-w-[180px]">
              <Button size="sm" onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                검색
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                초기화
              </Button>
            </div>
          </div>
        </div>
      </Card>

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

        {activeTabData?.description && (
          <>
            <span className="text-gray-400">·</span>
            <span>{activeTabData.description}</span>
          </>
        )}
      </div>

      <ExportDataGrid
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

export default ExportReviewPage;
