import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useImportListController } from "../../../controller/custom/import/useImportListController";
import Card from "../../../style/components/Card";
import Button from "../../../style/components/Button";
import Select from "../../../style/components/form/Select";
import Input from "../../../style/components/Input";
import { FileText, RefreshCw, Search, ChevronRight } from "lucide-react";
import ImportDataGrid from "../../components/ImportDataGrid";
import { FILTERABLE_STATUSES, URGENT_OPTIONS, STATUS_LABELS } from "../../../domain/customs/import/importConstants";
import { SUPPLEMENT_REVIEW_TABS } from "../../../domain/customs/supplement/supplementConstants";

// src/pages/customs/supplement/SupplementReviewPage.jsx

function SupplementReviewPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [localFilters, setLocalFilters] = useState({
    status: "",
    isUrgent: "",
    assignedOfficer: "",
    search: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({});

  // Tab 데이터 찾기
  const activeTabData = useMemo(() => {
    return SUPPLEMENT_REVIEW_TABS.find((tab) => tab.id === activeTab);
  }, [activeTab]);

  // mergedFilters 생성
  const mergedFilters = useMemo(() => {
    const tabFilter = activeTabData?.filter || {};
    return { ...tabFilter, ...appliedFilters };
  }, [activeTabData, appliedFilters]);

  const { declarations, totalCount, statusCounts, isLoading, error, refetch } = useImportListController(mergedFilters);

  // ✅ 탭별 통계 표시 로직
  const displayStats = useMemo(() => {
    if (!statusCounts) return [];

    const stats = [];

    switch (activeTab) {
      case "request": {
        // 보완/정정 요구
        stats.push({ label: STATUS_LABELS.SUPPLEMENT_REQUESTED, count: statusCounts.SUPPLEMENT_REQUESTED || 0 });
        stats.push({ label: STATUS_LABELS.CORRECTION_REQUESTED, count: statusCounts.CORRECTION_REQUESTED || 0 });
        break;
      }

      case "submitted": {
        // 제출 현황 조회
        stats.push({ label: STATUS_LABELS.SUPPLEMENT_SUBMITTED, count: statusCounts.SUPPLEMENT_SUBMITTED || 0 });
        stats.push({ label: STATUS_LABELS.CORRECTION_SUBMITTED, count: statusCounts.CORRECTION_SUBMITTED || 0 });
        break;
      }

      case "review": {
        // 재심사 및 승인
        stats.push({ label: STATUS_LABELS.SUPPLEMENT_REVIEW, count: statusCounts.SUPPLEMENT_REVIEW || 0 });
        stats.push({ label: STATUS_LABELS.CORRECTION_REVIEW, count: statusCounts.CORRECTION_REVIEW || 0 });
        break;
      }

      case "all": {
        // 전체: 총 건수 + 보완 관련 + 정정 관련
        stats.push({ label: "총", count: totalCount, showTotal: true });
        const supplementTotal =
          (statusCounts.SUPPLEMENT_REQUESTED || 0) + (statusCounts.SUPPLEMENT_SUBMITTED || 0) + (statusCounts.SUPPLEMENT_REVIEW || 0);
        const correctionTotal =
          (statusCounts.CORRECTION_REQUESTED || 0) + (statusCounts.CORRECTION_SUBMITTED || 0) + (statusCounts.CORRECTION_REVIEW || 0);
        stats.push({ label: "보완 진행", count: supplementTotal });
        stats.push({ label: "정정 진행", count: correctionTotal });
        break;
      }

      default: {
        stats.push({ label: "총", count: totalCount, showTotal: true });
        break;
      }
    }

    return stats;
  }, [activeTab, statusCounts, totalCount]);

  const handleLocalChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const newFilters = {};

    if (localFilters.status) {
      newFilters.status = localFilters.status;
    }

    if (localFilters.isUrgent !== "") {
      newFilters.isUrgent = localFilters.isUrgent === "true";
    }

    if (localFilters.assignedOfficer) {
      newFilters.assignedOfficer = localFilters.assignedOfficer;
    }

    if (localFilters.search) {
      newFilters.search = localFilters.search;
    }

    setAppliedFilters(newFilters);
  };

  const handleReset = () => {
    setLocalFilters({
      status: "",
      isUrgent: "",
      assignedOfficer: "",
      search: "",
    });
    setAppliedFilters({});
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
    navigate(`/customs/supplement/detail/${declarationId}`);
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
      {/* ========== Breadcrumb ========== */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="font-medium text-gray-900">보완/정정 관리</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-600">{activeTabData?.label || "전체"}</span>
      </div>

      <Card>
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">보완/정정 관리</h1>
          </div>
        </div>

        {/* Tab 네비게이션 */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {SUPPLEMENT_REVIEW_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  px-[52.7px] py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap
                  ${
                    activeTab === tab.id ? "text-[#0f4c81] border-[#0f4c81]" : "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 검색 필터 */}
        <div className="p-4 bg-gray-50">
          <div className="flex items-center gap-4">
            {/* 1. 상태 */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">상태 :</label>
              <Select value={localFilters.status} onChange={(e) => handleLocalChange("status", e.target.value)} className="w-[110px]">
                <option value="">전체</option>
                {FILTERABLE_STATUSES.filter((s) => s.value.includes("SUPPLEMENT") || s.value.includes("CORRECTION")).map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* 2. 긴급 */}
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

            {/* 3. 담당자 */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">담당자 :</label>
              <Input
                type="text"
                placeholder="담당자명"
                value={localFilters.assignedOfficer}
                onChange={(e) => handleLocalChange("assignedOfficer", e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-[120px]"
              />
            </div>

            {/* 4. 검색 */}
            <div className="flex items-center gap-2 flex-1">
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

            {/* 버튼 */}
            <div className="flex gap-2">
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

      {/* ========== 탭별 통계 표시 ========== */}
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

        {/* 탭 설명 */}
        {activeTabData?.description && (
          <>
            <span className="text-gray-400">·</span>
            <span>{activeTabData.description}</span>
          </>
        )}
      </div>

      {/* ========== 데이터 그리드 ========== */}
      <ImportDataGrid declarations={declarations} isLoading={isLoading} onRowClicked={onRowClicked} />
    </div>
  );
}

export default SupplementReviewPage;
