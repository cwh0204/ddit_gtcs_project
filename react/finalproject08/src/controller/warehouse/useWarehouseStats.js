// src/controller/warehouse/useWarehouseStats.js

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/common/queryKeys";
import warehouseApi from "../../api/warehouse/warehouseApi";
import { mapWarehouseStats } from "../../domain/warehouse/warehouseMapper";

/**
 * 창고 운영 통계
 * OperationChart, InspectionChart, ZoneStatisticsPage에서 사용
 * 백엔드 미구현 — 각 컴포넌트에서 Mock 데이터로 대체 동작 중
 */
export const useWarehouseStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.warehouse.stats(),
    queryFn: async () => {
      const data = await warehouseApi.getStats();
      return mapWarehouseStats(data);
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000,
  });
};
