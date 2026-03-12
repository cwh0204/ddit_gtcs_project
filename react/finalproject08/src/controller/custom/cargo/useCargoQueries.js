// src/controller/customs/cargo/useCargoQueries.js

import { useQuery } from "@tanstack/react-query";
import { cargoApi } from "../../../api/customs/cargo/cargoApi";
import { QUERY_KEYS } from "../../../constants/common/queryKeys";

/**
 * 세관원용 화물 진행 현황 Query Hooks
 * ✅ 읽기 전용 (조회만)
 */

/**
 * 화물 목록 조회
 * @param {Object} filters - 필터 조건
 * @param {string} filters.cargoType - "import" | "export"
 */
export const useCargoList = (filters = {}) => {
  return useQuery({
    queryKey: ["cargo-tracking", "list", filters.cargoType],
    queryFn: () => cargoApi.getList(filters),
    staleTime: 30 * 1000, // 30초
    refetchInterval: 30 * 1000, // 30초마다 자동 갱신
    refetchIntervalInBackground: true,
  });
};

/**
 * 화물 상세 조회
 * @param {number} stockId - 재고 ID
 */
export const useCargoDetail = (stockId) => {
  return useQuery({
    queryKey: ["cargo-tracking", "detail", stockId],
    queryFn: () => cargoApi.getDetail(stockId),
    staleTime: 60 * 1000, // 1분
    enabled: !!stockId,
  });
};
