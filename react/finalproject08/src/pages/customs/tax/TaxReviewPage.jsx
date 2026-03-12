import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useImportListController } from "../../../controller/custom/import/useImportListController";
import Card from "../../../style/components/Card";
import Button from "../../../style/components/Button";
import Select from "../../../style/components/form/Select";
import Input from "../../../style/components/Input";
import { FileText, RefreshCw, Search, ChevronRight } from "lucide-react";
import ImportDataGrid from "../../components/ImportDataGrid";
import { URGENT_OPTIONS, STATUS_LABELS } from "../../../domain/customs/import/importConstants";

// src/pages/customs/tax/TaxReviewPage.jsx

/**
 * 세액 및 납부 관리 페이지
 *
 * ⭐ 수리(clearance) 버튼 클릭 시 자동으로 NOTICE_ISSUED로 변경되므로
 * APPROVED 상태는 이 페이지에 도달하지 않음
 */

// 세액/납부 관련 탭 정의
const TAX_REVIEW_TABS = [
  {
    id: "all",
    label: "전체 목록",
    filter: {
      status: ["NOTICE_ISSUED", "PAYMENT_PENDING", "PAYMENT_COMPLETED"],
    },
    description: "고지서 발송 이후 모든 건",
  },
  {
    id: "notice",
    label: "고지서 발송",
    filter: {
      status: "NOTICE_ISSUED",
    },
    description: "고지서가 발송된 건",
  },
  {
    id: "pending",
    label: "납부 대기",
    filter: {
      status: "PAYMENT_PENDING",
    },
    description: "납부 대기 중인 건",
  },
  {
    id: "completed",
    label: "납부 완료",
    filter: {
      status: "PAYMENT_COMPLETED",
    },
    description: "납부가 완료된 건",
  },
];

// 필터 가능한 상태 (APPROVED 제거)
const FILTERABLE_TAX_STATUSES = [
  { value: "NOTICE_ISSUED", label: "고지서 발송" },
  { value: "PAYMENT_PENDING", label: "납부 대기" },
  { value: "PAYMENT_COMPLETED", label: "납부 완료" },
];

function TaxReviewPage() {
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
    return TAX_REVIEW_TABS.find((tab) => tab.id === activeTab);
  }, [activeTab]);

  // mergedFilters 생성
  const mergedFilters = useMemo(() => {
    const tabFilter = activeTabData?.filter || {};
    return { ...tabFilter, ...appliedFilters };
  }, [activeTabData, appliedFilters]);

  const { declarations, totalCount, statusCounts, isLoading, error, refetch } = useImportListController(mergedFilters);

  // 탭별 통계 표시 로직 (APPROVED 제거)
  const displayStats = useMemo(() => {
    if (!statusCounts) return [];

    const stats = [];

    switch (activeTab) {
      case "all": {
        // 전체: 총 건수 + 각 상태별 (APPROVED 제외)
        stats.push({ label: "총", count: totalCount, showTotal: true });
        stats.push({ label: STATUS_LABELS.NOTICE_ISSUED, count: statusCounts.NOTICE_ISSUED || 0 });
        stats.push({ label: STATUS_LABELS.PAYMENT_PENDING, count: statusCounts.PAYMENT_PENDING || 0 });
        stats.push({ label: STATUS_LABELS.PAYMENT_COMPLETED, count: statusCounts.PAYMENT_COMPLETED || 0 });
        break;
      }

      case "notice": {
        stats.push({ label: STATUS_LABELS.NOTICE_ISSUED, count: statusCounts.NOTICE_ISSUED || 0 });
        break;
      }

      case "pending": {
        stats.push({ label: STATUS_LABELS.PAYMENT_PENDING, count: statusCounts.PAYMENT_PENDING || 0 });
        break;
      }

      case "completed": {
        stats.push({ label: STATUS_LABELS.PAYMENT_COMPLETED, count: statusCounts.PAYMENT_COMPLETED || 0 });
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
    navigate(`/customs/tax/detail/${declarationId}`);
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
        <span className="font-medium text-gray-900">세액 및 납부</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-600">{activeTabData?.label || "전체"}</span>
      </div>

      <Card>
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">세액 및 납부 관리</h1>
            <p className="text-sm text-gray-600 mt-1">고지서 발송 이후 납부 관리</p>
          </div>
        </div>

        {/* Tab 네비게이션 (승인 완료 탭 제거) */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {TAX_REVIEW_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  px-6 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap
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
            {/* 1. 상태 (APPROVED 제거) */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">상태 :</label>
              <Select value={localFilters.status} onChange={(e) => handleLocalChange("status", e.target.value)} className="w-[140px]">
                <option value="">전체</option>
                {FILTERABLE_TAX_STATUSES.map((status) => (
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

export default TaxReviewPage;
