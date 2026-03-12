import { useState } from "react";

//src/hooks/useimportFilters.js
export function useImportFilters(initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState({});

  const handleSearch = () => {
    const newFilters = {};

    if (filters.status) {
      newFilters.status = filters.status;
    }

    if (filters.search) {
      newFilters.search = filters.search;
    }

    if (filters.isUrgent) {
      newFilters.isUrgent = filters.isUrgent === "true";
    }

    if (filters.assignedOfficer) {
      newFilters.assignedOfficer = filters.assignedOfficer;
    }

    setAppliedFilters(newFilters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setAppliedFilters({});
  };

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
