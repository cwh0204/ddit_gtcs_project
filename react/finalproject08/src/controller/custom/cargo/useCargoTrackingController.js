// src/controller/customs/cargo/useCargoTrackingController.js

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCargoList } from "./useCargoQueries";
import { mapCargoList } from "../../../domain/warehouse/warehouseMapper";

/**
 * 세관원용 화물 진행 현황 Controller
 * ✅ 창고관리자와 동일한 데이터 소스 사용
 * ✅ 하지만 도메인이 다르므로 별도 Controller
 */

const CARGO_TABS = [
  { id: "bonded", label: "보세구역", filter: { positionArea: "BONDED" } },
  { id: "inspection", label: "검사목록", filter: { status: "PHYSICAL" } },
  { id: "inspection-completed", label: "검사완료", filter: { status: "INSPECTION_COMPLETED" } },
  { id: "release-approved", label: "반출승인", filter: { status: "APPROVED" } },
  { id: "release-blocked", label: "반출차단", filter: { status: "RELEASE_REJECTED" } },
  { id: "domestic", label: "국내구역", filter: { positionArea: "LOCAL" } },
  { id: "cleared", label: "통관완료", filter: { status: "CLEARED" } },
];

/**
 * 탭별 필터링 (순수 함수)
 */
const filterByTab = (cargos, tabId, cargoType) => {
  // 보세구역
  if (tabId === "bonded") {
    return cargos.filter((c) => c.positionArea === "BONDED");
  }

  // 국내구역
  if (tabId === "domestic") {
    return cargos.filter((c) => c.positionArea === "LOCAL");
  }

  // 검사목록 (PHYSICAL 상태)
  if (tabId === "inspection") {
    return cargos.filter((c) => {
      const master = cargoType === "import" ? c.importMaster : c.exportMaster;
      return master?.status?.toUpperCase() === "PHYSICAL";
    });
  }

  // 검사완료
  if (tabId === "inspection-completed") {
    return cargos.filter((c) => {
      const master = cargoType === "import" ? c.importMaster : c.exportMaster;
      return master?.status?.toUpperCase() === "INSPECTION_COMPLETED";
    });
  }

  // 반출승인
  if (tabId === "release-approved") {
    return cargos.filter((c) => {
      const master = cargoType === "import" ? c.importMaster : c.exportMaster;
      return master?.status?.toUpperCase() === "APPROVED";
    });
  }

  // 반출차단
  if (tabId === "release-blocked") {
    return cargos.filter((c) => {
      const master = cargoType === "import" ? c.importMaster : c.exportMaster;
      return master?.status?.toUpperCase() === "RELEASE_REJECTED";
    });
  }

  // 통관완료
  if (tabId === "cleared") {
    return cargos.filter((c) => {
      const master = cargoType === "import" ? c.importMaster : c.exportMaster;
      return master?.status?.toUpperCase() === "CLEARED";
    });
  }

  return cargos;
};

/**
 * 추가 필터 적용 (검색, 긴급, 날짜)
 */
const applyFilters = (cargos, appliedFilters, cargoType) => {
  let result = [...cargos];

  // 검색
  if (appliedFilters.search) {
    const q = appliedFilters.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.containerId?.toLowerCase().includes(q) ||
        c.itemName?.toLowerCase().includes(q) ||
        c.declNo?.toLowerCase().includes(q) ||
        c.owner?.toLowerCase().includes(q),
    );
  }

  // 상태 필터 (탭과 중복되지 않는 경우만)
  if (appliedFilters.status) {
    result = result.filter((c) => {
      const master = cargoType === "import" ? c.importMaster : c.exportMaster;
      return master?.status?.toUpperCase() === appliedFilters.status.toUpperCase();
    });
  }

  // 긴급 필터
  if (appliedFilters.isUrgent !== undefined && appliedFilters.isUrgent !== "") {
    result = result.filter((c) => c.isUrgent === appliedFilters.isUrgent);
  }

  // 시작일
  if (appliedFilters.startDate) {
    result = result.filter((c) => c.inboundDate >= appliedFilters.startDate);
  }

  // 종료일
  if (appliedFilters.endDate) {
    result = result.filter((c) => c.inboundDate <= appliedFilters.endDate);
  }

  return result;
};

/**
 * Main Controller
 */
export const useCargoTrackingController = () => {
  const navigate = useNavigate();
  const [cargoType, setCargoType] = useState("import");
  const [activeTab, setActiveTab] = useState("bonded");
  const [currentPage, setCurrentPage] = useState(1); // ⭐ 페이징 상태
  const pageSize = 10; // ⭐ 페이지당 10개

  const [filters, setFilters] = useState({
    status: "",
    isUrgent: "",
    search: "",
    startDate: "",
    endDate: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const { data: rawData, isLoading, error } = useCargoList({ cargoType });
  const allCargos = useMemo(() => (rawData ? mapCargoList(rawData) : []), [rawData]);
  const filteredCargos = useMemo(() => {
    const byTab = filterByTab(allCargos, activeTab, cargoType);
    return applyFilters(byTab, appliedFilters, cargoType);
  }, [allCargos, activeTab, cargoType, appliedFilters]);

  const totalCount = filteredCargos.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const cargos = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredCargos.slice(startIndex, endIndex);
  }, [filteredCargos, currentPage, pageSize]);

  const tabCounts = useMemo(
    () =>
      CARGO_TABS.reduce((counts, tab) => {
        counts[tab.id] = filterByTab(allCargos, tab.id, cargoType).length;
        return counts;
      }, {}),
    [allCargos, cargoType],
  );

  const statusStats = useMemo(() => {
    const stats = {};
    filteredCargos.forEach((c) => {
      const master = cargoType === "import" ? c.importMaster : c.exportMaster;
      const status = master?.statusLabel || "미등록";
      stats[status] = (stats[status] || 0) + 1;
    });
    return stats;
  }, [filteredCargos, cargoType]);

  const handleRowClick = (event) => {
    const cargoId = event.data?.stockId || event.data?.id;
    if (cargoId) navigate(`/customs/cargo/tracking/${cargoId}`);
  };

  const handleCargoTypeToggle = (type) => {
    setCargoType(type);
    setActiveTab("bonded");
    setCurrentPage(1);
    setFilters({ status: "", isUrgent: "", search: "", startDate: "", endDate: "" });
    setAppliedFilters({});
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const newFilters = {};
    if (filters.status) newFilters.status = filters.status;
    if (filters.isUrgent !== "" && filters.isUrgent !== undefined) {
      newFilters.isUrgent = filters.isUrgent === "true" || filters.isUrgent === true;
    }
    if (filters.search) newFilters.search = filters.search;
    if (filters.startDate) newFilters.startDate = filters.startDate;
    if (filters.endDate) newFilters.endDate = filters.endDate;
    setAppliedFilters(newFilters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({ status: "", isUrgent: "", search: "", startDate: "", endDate: "" });
    setAppliedFilters({});
    setCurrentPage(1);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    handleReset();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
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
    currentTabs: CARGO_TABS,

    // 핸들러
    handleRowClick,
    handleCargoTypeToggle,
    handleTabChange,
    handleFilterChange,
    handleSearch,
    handleReset,
    handlePageChange,
  };
};

export default useCargoTrackingController;
