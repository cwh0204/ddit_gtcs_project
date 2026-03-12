import { useState } from "react";

/**
 * src/hooks/useExportFilters.js
 *
 * 📌 수출신고 필터 관리 훅
 * - 필터 상태 관리 및 적용
 */
export function useExportFilters(initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState({});

  /**
   * 필터 적용 (검색 실행)
   */
  const handleSearch = () => {
    const newAppliedFilters = {};

    if (filters.status) {
      newAppliedFilters.status = filters.status;
    }

    if (filters.isUrgent !== "" && filters.isUrgent !== undefined) {
      newAppliedFilters.isUrgent = filters.isUrgent === "true" || filters.isUrgent === true;
    }

    if (filters.assignedOfficer) {
      newAppliedFilters.assignedOfficer = filters.assignedOfficer;
    }

    if (filters.search) {
      newAppliedFilters.search = filters.search;
    }

    setAppliedFilters(newAppliedFilters);
  };

  /**
   * 필터 초기화
   */
  const handleReset = () => {
    setFilters(initialFilters);
    setAppliedFilters({});
  };

  /**
   * 개별 필터 업데이트
   *
   */
  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    filters,
    setFilters,
    updateFilter,
    appliedFilters,
    handleSearch,
    handleReset,
  };
}

export default useExportFilters;
