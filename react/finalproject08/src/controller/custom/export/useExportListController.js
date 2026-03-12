// src/controller/customs/export/useExportListController.js

import { useQuery } from "@tanstack/react-query";
import { exportApi } from "../../../api/customs/export/exportApi";
import { useAuth } from "../../../hooks/useAuth";
import {
  mapExportDeclarationList,
  calculateStatusCounts,
  calculateUrgentCount,
  calculateRiskLevelCounts,
  calculateOfficerCounts,
} from "../../../domain/customs/export/exportMapper";

/**
 * 수출신고서 목록 조회 Controller (프론트엔드 페이징)
 */
export const useExportListController = (filters = {}, page = 1, pageSize = 10, options = {}) => {
  const { user } = useAuth();

  // 전체 상태별 카운트를 위한 별도 쿼리 (탭 필터 무관하게 항상 전체 조회)
  const { data: allStatusRawData } = useQuery({
    queryKey: ["exportDeclarations", "allStatusCounts"],
    queryFn: async () => {
      const response = await exportApi.getList({}, user);
      console.log("=== [수출 목록 Mapper 가공 후 데이터] ===", response);
      let allData = [];
      if (Array.isArray(response)) allData = response;
      else if (response?.data && Array.isArray(response.data)) allData = response.data;
      else if (response?.content && Array.isArray(response.content)) allData = response.content;
      if (user?.memRole === "OFFICER" && user?.memId) {
        allData = allData.filter((item) => item.officerId === user.memId);
      }
      return allData;
    },
    enabled: options.enabled !== false,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const {
    data: rawData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["exportDeclarations", filters],

    queryFn: async () => {
      const response = await exportApi.getList(filters, user);

      let allData = [];

      if (Array.isArray(response)) {
        allData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        allData = response.data;
      } else if (response?.content && Array.isArray(response.content)) {
        allData = response.content;
      } else {
        return [];
      }

      // 세관원(OFFICER)인 경우 자기 배정 건만 필터링
      if (user?.memRole === "OFFICER" && user?.memId) {
        allData = allData.filter((item) => item.officerId === user.memId);
      }

      // 필터가 없으면 전체 반환
      if (!filters || Object.keys(filters).length === 0) {
        return allData;
      }

      // 클라이언트 사이드 필터링
      let filtered = allData;

      // 상태 필터
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          filtered = filtered.filter((item) => filters.status.includes(item.status));
        } else {
          filtered = filtered.filter((item) => item.status === filters.status);
        }
      }

      // 긴급 여부 필터
      if (filters.isUrgent !== undefined && filters.isUrgent !== null && filters.isUrgent !== "") {
        const isUrgentBool = filters.isUrgent === true || filters.isUrgent === "true";
        filtered = filtered.filter((item) => {
          const isUrgent = item.isUrgent === true || item.isUrgent === "Y";
          return isUrgent === isUrgentBool;
        });
      }

      // 담당자 필터
      if (filters.assignedOfficer) {
        filtered = filtered.filter((item) => item.assignedOfficer?.includes(filters.assignedOfficer));
      }

      // 검색어 필터
      if (filters.search && filters.search.trim()) {
        const searchLower = filters.search.toLowerCase().trim();
        filtered = filtered.filter((item) => {
          const exportNumber = (item.exportNumber || "").toLowerCase();
          const exporterName = (item.exporterName || "").toLowerCase();
          return exportNumber.includes(searchLower) || exporterName.includes(searchLower);
        });
      }

      // 날짜 필터
      if (filters.startDate) {
        filtered = filtered.filter((item) => {
          const dateStr = item.regDate;
          if (!dateStr || typeof dateStr !== "string") return false;
          const date = dateStr.substring(0, 10);
          return date >= filters.startDate;
        });
      }

      if (filters.endDate) {
        filtered = filtered.filter((item) => {
          const dateStr = item.regDate;
          if (!dateStr || typeof dateStr !== "string") return false;
          const date = dateStr.substring(0, 10);
          return date <= filters.endDate;
        });
      }

      return filtered;
    },

    enabled: options.enabled !== false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // ========== 프론트엔드 페이징 처리 ==========
  const totalCount = rawData ? rawData.length : 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedData = rawData ? rawData.slice(startIndex, endIndex) : [];

  // ========== 데이터 변환 (DTO → UI Model) ==========

  const declarations = pagedData.length > 0 ? mapExportDeclarationList(pagedData) : [];

  const statusCounts = allStatusRawData ? calculateStatusCounts(allStatusRawData) : { total: 0 };
  const urgentCount = allStatusRawData ? calculateUrgentCount(allStatusRawData) : 0;
  const riskLevelCounts = allStatusRawData ? calculateRiskLevelCounts(allStatusRawData) : { RED: 0, GREEN: 0 };
  const officerCounts = allStatusRawData ? calculateOfficerCounts(allStatusRawData) : {};

  return {
    declarations,

    totalCount,
    totalPages,
    currentPage: page,
    pageSize,

    statusCounts,
    urgentCount,
    riskLevelCounts,
    officerCounts,

    isLoading,
    error,

    refetch,
  };
};

export default useExportListController;
