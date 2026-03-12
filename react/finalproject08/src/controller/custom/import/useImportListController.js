/**
 * src/controller/custom/import/useImportListController.js
 * 수입신고서 목록 조회 커스텀 훅 (페이징 지원)
 */

import { useQuery } from "@tanstack/react-query";
import { importApi } from "../../../api/customs/import/importApi";
import { importMapper } from "../../../domain/customs/import/importMapper";
import { useAuth } from "../../../hooks/useAuth";

const calculateStatusCounts = (rawData) => {
  if (!rawData || !Array.isArray(rawData)) {
    return { total: 0 };
  }

  const counts = rawData.reduce(
    (acc, item) => {
      const status = item.status || "UNKNOWN";
      acc[status] = (acc[status] || 0) + 1;
      acc.total = (acc.total || 0) + 1;
      return acc;
    },
    { total: 0 },
  );

  return counts;
};

const calculateUrgentCount = (rawData) => {
  if (!rawData || !Array.isArray(rawData)) {
    return 0;
  }
  return rawData.filter((item) => item.isUrgent === true).length;
};

const calculateRiskLevelCounts = (rawData) => {
  if (!rawData || !Array.isArray(rawData)) {
    return { LOW: 0, MEDIUM: 0, HIGH: 0 };
  }

  return rawData.reduce(
    (acc, item) => {
      const riskLevel = item.riskLevel || "MEDIUM";
      acc[riskLevel] = (acc[riskLevel] || 0) + 1;
      return acc;
    },
    { LOW: 0, MEDIUM: 0, HIGH: 0 },
  );
};

const calculateOfficerCounts = (rawData) => {
  if (!rawData || !Array.isArray(rawData)) {
    return {};
  }

  return rawData.reduce((acc, item) => {
    const officer = item.assignedOfficer || "미배정";
    acc[officer] = (acc[officer] || 0) + 1;
    return acc;
  }, {});
};

export const useImportListController = (filters = {}, page = 1, pageSize = 10, options = {}) => {
  const { user } = useAuth();

  // 전체 상태별 카운트를 위한 별도 쿼리 (탭 필터 무관하게 항상 전체 조회)
  const { data: allStatusData } = useQuery({
    queryKey: ["importDeclarations", "allStatusCounts"],
    queryFn: async () => {
      const response = await importApi.getList({ status: "ALL", pageNum: 1, amount: 9999 }, user);
      let allData = [];
      if (Array.isArray(response)) allData = response;
      else if (response?.data && Array.isArray(response.data)) allData = response.data;
      else if (response?.content && Array.isArray(response.content)) allData = response.content;
      return allData;
    },
    enabled: options.enabled !== false && !!user,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["importDeclarations", filters, page, pageSize],

    queryFn: async () => {
      const apiParams = {
        ...filters,
        pageNum: page,
        amount: pageSize,
      };

      const response = await importApi.getList(apiParams, user);

      let allData = [];

      if (Array.isArray(response)) {
        allData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        allData = response.data;
      } else if (response?.content && Array.isArray(response.content)) {
        allData = response.content;
      } else {
        return { content: [], totalCount: 0, totalPages: 0 };
      }

      const totalCount = allData.length > 0 ? allData[0].totalCount || allData.length : 0;
      const totalPages = allData.length > 0 ? allData[0].totalPage || 1 : 1;

      return {
        content: allData,
        totalCount,
        totalPages,
        currentPage: page,
        pageSize,
      };
    },

    enabled: options.enabled !== false && !!user,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // ========== 데이터 변환 (DTO → UI Model) ==========

  const rawData = apiResponse?.content || [];

  const declarations = rawData && Array.isArray(rawData) ? rawData.map((dto) => importMapper.toListItem(dto)).filter(Boolean) : [];

  const statusCounts = allStatusData ? calculateStatusCounts(allStatusData) : { total: 0 };
  const urgentCount = allStatusData ? calculateUrgentCount(allStatusData) : 0;
  const riskLevelCounts = allStatusData ? calculateRiskLevelCounts(allStatusData) : { LOW: 0, MEDIUM: 0, HIGH: 0 };
  const officerCounts = allStatusData ? calculateOfficerCounts(allStatusData) : {};

  return {
    declarations,

    totalCount: apiResponse?.totalCount || 0,
    totalPages: apiResponse?.totalPages || 1,
    currentPage: apiResponse?.currentPage || 1,
    pageSize: apiResponse?.pageSize || pageSize,

    statusCounts,
    urgentCount,
    riskLevelCounts,
    officerCounts,

    isLoading,
    error,

    refetch,
  };
};

export default useImportListController;
