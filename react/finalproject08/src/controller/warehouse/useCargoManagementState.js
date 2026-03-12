// src/controller/warehouse/useCargoManagementState.js

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCargoList } from "./useZonesAndCargo";
import { mapCargoList } from "../../domain/warehouse/warehouseMapper";
import { IMPORT_CARGO_TABS, EXPORT_CARGO_TABS } from "../../domain/warehouse/constants/uiConfig";

const filterByTab = (cargos, tabId, cargoType) => {
  if (tabId === "bonded") return cargos.filter((c) => c.positionArea === "BONDED");
  if (tabId === "local") return cargos.filter((c) => c.positionArea === "LOCAL");

  if (tabId === "inspection") {
    return cargos.filter((c) => {
      const master = cargoType === "import" ? c.importMaster : c.exportMaster;
      const idKey = cargoType === "import" ? "importId" : "exportId";
      const id = master?.[idKey];
      return id && String(id).trim() !== "" && String(id).toLowerCase() !== "null" && master?.status?.toUpperCase() === "PHYSICAL";
    });
  }

  if (cargoType === "import") return cargos.filter((c) => c.isImport);
  if (cargoType === "export") return cargos.filter((c) => c.isExport);
  return cargos;
};

const applyFilters = (cargos, appliedFilters, cargoType) => {
  let result = [...cargos];

  if (appliedFilters.search) {
    const q = appliedFilters.search.toLowerCase();
    result = result.filter(
      (c) => c.containerId?.toLowerCase().includes(q) || c.itemName?.toLowerCase().includes(q) || c.declNo?.toLowerCase().includes(q),
    );
  }

  if (appliedFilters.status) {
    result = result.filter((c) => {
      const master = cargoType === "import" ? c.importMaster : c.exportMaster;
      return master?.status?.toUpperCase() === appliedFilters.status.toUpperCase();
    });
  }

  if (appliedFilters.isUrgent !== undefined && appliedFilters.isUrgent !== "") {
    result = result.filter((c) => c.isUrgent === appliedFilters.isUrgent);
  }

  if (appliedFilters.startDate) {
    result = result.filter((c) => c.inboundDate >= appliedFilters.startDate);
  }

  if (appliedFilters.endDate) {
    result = result.filter((c) => c.inboundDate <= appliedFilters.endDate);
  }

  return result;
};

export const useCargoManagementState = () => {
  const navigate = useNavigate();
  const [cargoType, setCargoType] = useState("import");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [filters, setFilters] = useState({
    status: "",
    isUrgent: "",
    startDate: "",
    endDate: "",
    search: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({});

  const currentTabs = cargoType === "import" ? IMPORT_CARGO_TABS : EXPORT_CARGO_TABS;
  const { data: rawData, isLoading, error } = useCargoList({ cargoType });

  const allCargos = useMemo(() => (rawData ? mapCargoList(rawData) : []), [rawData]);

  // 최신 입고순 정렬: stockId 내림차순 → inboundDate 내림차순
  const filteredCargos = useMemo(() => {
    const byTab = filterByTab(allCargos, activeTab, cargoType);
    const filtered = applyFilters(byTab, appliedFilters, cargoType);
    return [...filtered].sort((a, b) => {
      const idDiff = (b.stockId ?? 0) - (a.stockId ?? 0);
      if (idDiff !== 0) return idDiff;
      const dateA = a.inboundDate ? new Date(a.inboundDate).getTime() : 0;
      const dateB = b.inboundDate ? new Date(b.inboundDate).getTime() : 0;
      return dateB - dateA;
    });
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
      currentTabs.reduce((counts, tab) => {
        counts[tab.id] = filterByTab(allCargos, tab.id, cargoType).length;
        return counts;
      }, {}),
    [allCargos, currentTabs, cargoType],
  );

  const handleRowClick = (event) => {
    const cargoId = event.data?.stockId || event.data?.id;
    if (cargoId) navigate(`/warehouse/cargo/${cargoId}`);
  };

  const handleCargoTypeToggle = (type) => {
    setCargoType(type);
    setActiveTab("all");
    setCurrentPage(1);
    setFilters({ status: "", isUrgent: "", startDate: "", endDate: "", search: "" });
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
    setFilters({ status: "", isUrgent: "", startDate: "", endDate: "", search: "" });
    setAppliedFilters({});
    setCurrentPage(1);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    cargos,
    tabCounts,
    totalCount,
    isLoading,
    error,
    currentPage,
    totalPages,
    pageSize,
    cargoType,
    activeTab,
    filters,
    currentTabs,
    handleRowClick,
    handleCargoTypeToggle,
    handleTabChange,
    handleFilterChange,
    handleSearch,
    handleReset,
    handlePageChange,
  };
};

export default useCargoManagementState;
