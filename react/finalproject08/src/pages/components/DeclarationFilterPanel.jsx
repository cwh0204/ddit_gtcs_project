// src/pages/components/DeclarationFilterPanel.jsx

import { useState } from "react";
import { Search } from "lucide-react";
import Card from "../../style/components/Card";
import Select from "../../style/components/form/Select";
import Button from "../../style/components/Button";
import Input from "../../style/components/Input";
import { FILTERABLE_STATUSES as IMPORT_STATUSES, URGENT_OPTIONS as IMPORT_URGENT } from "../../domain/customs/import/importConstants";
import { FILTERABLE_STATUSES as EXPORT_STATUSES, URGENT_OPTIONS as EXPORT_URGENT } from "../../domain/customs/export/exportConstants";
import { FILTERABLE_STATUSES as CARGO_STATUSES, URGENT_OPTIONS as CARGO_URGENT } from "../../domain/warehouse/warehouseConstants";

function DeclarationFilterPanel({ filters, onFilterChange, onSearch, onReset, type = "import", hideCard = false, hideStatusFilter = false }) {
  let FILTERABLE_STATUSES, URGENT_OPTIONS, searchPlaceholder;

  switch (type) {
    case "export":
      FILTERABLE_STATUSES = EXPORT_STATUSES;
      URGENT_OPTIONS = EXPORT_URGENT;
      searchPlaceholder = "신고번호";
      break;
    case "cargo":
      FILTERABLE_STATUSES = CARGO_STATUSES;
      URGENT_OPTIONS = CARGO_URGENT;
      searchPlaceholder = "컨테이너 ID, 품목명, 신고번호";
      break;
    case "import":
    default:
      FILTERABLE_STATUSES = IMPORT_STATUSES;
      URGENT_OPTIONS = IMPORT_URGENT;
      searchPlaceholder = "신고번호";
      break;
  }

  const [localFilters, setLocalFilters] = useState({
    status: filters.status ?? "",
    isUrgent: filters.isUrgent ?? "",
    assignedOfficer: filters.assignedOfficer ?? "",
    search: filters.search ?? "",
    startDate: filters.startDate ?? "",
    endDate: filters.endDate ?? "",
  });

  const handleLocalChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    Object.keys(localFilters).forEach((key) => {
      onFilterChange(key, localFilters[key]);
    });
    onSearch();
  };

  const handleReset = () => {
    const resetFilters = {
      status: "",
      isUrgent: "",
      assignedOfficer: "",
      search: "",
      startDate: "",
      endDate: "",
    };
    setLocalFilters(resetFilters);
    onReset();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // ⭐ 공통 필터 JSX (변수로 저장)
  const filterContent = (
    <>
      {/* ⭐ 1. 상태 (hideStatusFilter가 false일 때만 표시) */}
      {!hideStatusFilter && (
        <div className="flex items-center gap-2 flex-shrink-0">
          <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">상태 :</label>
          <Select value={localFilters.status} onChange={(e) => handleLocalChange("status", e.target.value)} className="w-27.5">
            <option value="">전체</option>
            {FILTERABLE_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
        </div>
      )}

      {/* 2. 긴급 */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">긴급 :</label>
        <Select value={localFilters.isUrgent} onChange={(e) => handleLocalChange("isUrgent", e.target.value)} className="w-20">
          <option value="">전체</option>
          {URGENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {/* 3. 날짜 */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">{type === "cargo" ? "입고등록일자 :" : "조회기간 :"}</label>
        <div className="flex items-center gap-1">
          <Input
            type="date"
            value={localFilters.startDate}
            onChange={(e) => handleLocalChange("startDate", e.target.value)}
            className="w-32.5"
            max={localFilters.endDate}
          />
          <span className="text-gray-500">~</span>
          <Input
            type="date"
            value={localFilters.endDate}
            onChange={(e) => handleLocalChange("endDate", e.target.value)}
            className="w-32.5"
            min={localFilters.startDate}
          />
        </div>
      </div>

      {/* 4. 검색어 */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">검색 :</label>
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={localFilters.search}
          onChange={(e) => handleLocalChange("search", e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-75"
        />
      </div>

      {/* 버튼들 */}
      <div className="flex gap-2 flex-shrink-0">
        <Button size="sm" onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          검색
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset}>
          초기화
        </Button>
      </div>
    </>
  );

  if (hideCard) {
    return <div className="flex items-center gap-4 flex-nowrap min-w-[1200px]">{filterContent}</div>;
  }

  return (
    <Card>
      <div className="p-4 min-w-[1200px]">
        <div className="flex items-center gap-4 flex-nowrap">{filterContent}</div>
      </div>
    </Card>
  );
}

export default DeclarationFilterPanel;
