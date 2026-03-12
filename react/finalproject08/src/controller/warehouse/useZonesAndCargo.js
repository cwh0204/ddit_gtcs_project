// src/controller/warehouse/useZonesAndCargo.js
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/common/queryKeys";
import warehouseApi from "../../api/warehouse/warehouseApi";

/**
 * Warehouse Cargo Query Hooks
 */

//화물 목록 조회
export const useCargoList = (filters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.warehouse.cargos.list(filters),
    queryFn: () => warehouseApi.getCargoList(filters),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    refetchIntervalInBackground: true,
  });
};

//화물 상세 조회
export const useCargoDetail = (stockId) => {
  return useQuery({
    queryKey: QUERY_KEYS.warehouse.cargos.detail(stockId),
    queryFn: () => warehouseApi.getCargoDetail(stockId),
    staleTime: 60 * 1000,
    enabled: !!stockId,
  });
};

/**
 * 컨테이너 번호로 화물 검색 (3D 뷰 SearchPanel 전용)
 * 1단계: locate API로 위치 + 기본 정보 조회
 * 2단계: stockId로 importMaster/exportMaster 포함 상세 조회
 */
export const useCargoByContainerNumber = (contNumber, positionArea = "BONDED") => {
  return useQuery({
    queryKey: QUERY_KEYS.warehouse.cargos.byContainerNumber(contNumber),
    queryFn: async () => {
      const locateResult = await warehouseApi.getCargoByContainerNumber(contNumber, positionArea);
      const stockId = locateResult?.stockId;
      if (!stockId) return locateResult;

      const detail = await warehouseApi.getCargoDetail(stockId);
      return {
        ...detail,
        warehouseId: detail?.warehouseId || locateResult?.warehouseId,
      };
    },
    staleTime: 60 * 1000,
    enabled: !!contNumber && contNumber.trim().length > 0,
    retry: false,
  });
};

/**
 * 품명으로 화물 검색 (3D 뷰 SearchPanel 전용)
 * 1단계: 전체 목록에서 itemName 필터링
 * 2단계: stockId로 상세 조회 → warehouseId 확보 (하이라이트/줌인에 필수)
 *
 * @param {string} itemName - 검색어 (품명)
 * @param {string} positionArea - "BONDED" | "LOCAL"
 * @param {boolean} enabled - 컨테이너 번호 검색 결과가 없을 때만 true
 */
export const useCargoByItemName = (itemName, positionArea = "BONDED") => {
  return useQuery({
    queryKey: QUERY_KEYS.warehouse.cargos.list({ itemName, positionArea }),
    queryFn: async () => {
      const cargoType = positionArea === "BONDED" ? "import" : "export";
      const list = await warehouseApi.getCargoList({ cargoType });
      if (!Array.isArray(list)) return null;

      const kw = itemName.trim().toLowerCase();
      const matched = list.filter((c) => (c.itemName || "").toLowerCase().includes(kw));
      if (matched.length === 0) return null;

      const first = matched[0];
      const stockId = first.stockId;
      if (!stockId) return null;

      const detail = await warehouseApi.getCargoDetail(stockId);
      if (!detail?.warehouseId) return null;

      return {
        ...detail,
        warehouseId: detail.warehouseId,
        _matchedCount: matched.length,
        _searchedByItemName: true,
      };
    },
    staleTime: 60 * 1000,
    enabled: !!itemName && itemName.trim().length > 0,
    retry: false,
  });
};
