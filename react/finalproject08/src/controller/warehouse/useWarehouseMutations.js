// src/controller/warehouse/useWarehouseMutations.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import warehouseApi from "../../api/warehouse/warehouseApi";
import { QUERY_KEYS } from "../../constants/common/queryKeys";

export const useWarehouseMutations = () => {
  const queryClient = useQueryClient();

  // ========== 공통 캐시 삭제 ==========
  const invalidateWarehouseCargos = () => {
    queryClient.removeQueries({ queryKey: QUERY_KEYS.warehouse.cargos.all() });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.warehouse.inspections.all() });
  };

  // ========== 화물 입고 등록 ==========
  const createCargoEntry = useMutation({
    mutationFn: ({ data, file }) => warehouseApi.createCargoEntry(data, file),

    onSuccess: () => {
      invalidateWarehouseCargos();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.warehouse.stock.all() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.warehouse.zones.all() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.warehouse.stats() });
    },

    onError: (error) => {
      console.error("[createCargoEntry] 오류:", error);
      throw new Error("화물 입고에 실패했습니다.");
    },
  });

  // ========== 화물 위치 이동 ==========
  const updateCargoLocation = useMutation({
    mutationFn: ({ stockId, newWarehouseId, newPositionArea }) => warehouseApi.updateCargoLocation(stockId, newWarehouseId, newPositionArea),

    onSuccess: (result, variables) => {
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.warehouse.cargos.detail(variables.stockId),
      });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.warehouse.cargos.all() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.warehouse.zones.all() });
    },

    onError: (error) => {
      console.error("[updateCargoLocation] 오류:", error);
      throw new Error("위치 이동에 실패했습니다.");
    },
  });

  // ========== 수입 검사완료 / 반출차단 / 반출승인 / 출고완료 ==========
  const completeImportInspection = useMutation({
    mutationFn: ({ importNumber, status, damagedYn, damagedComment, photoFile }) =>
      warehouseApi.updateImportInspectionStatus(importNumber, { status, damagedYn, damagedComment, photoFile }),

    onSuccess: () => {
      // ✅ 조건 없이 무조건 캐시 삭제
      invalidateWarehouseCargos();
      queryClient.removeQueries({ queryKey: QUERY_KEYS.import.declarations.all() });
    },

    onError: (error) => {
      console.error("[completeImportInspection] 오류:", error);
      throw new Error("수입 검사 처리에 실패했습니다.");
    },
  });

  // ========== 수출 검사완료 / 반출차단 / 반출승인 / 출고완료 ==========
  const completeExportInspection = useMutation({
    mutationFn: ({ exportNumber, status, damagedYn, damagedComment, photoFile }) =>
      warehouseApi.updateExportInspectionStatus(exportNumber, { status, damagedYn, damagedComment, photoFile }),

    onSuccess: () => {
      // ✅ 조건 없이 무조건 캐시 삭제
      invalidateWarehouseCargos();
      queryClient.removeQueries({ queryKey: QUERY_KEYS.export.declarations.all() });
    },

    onError: (error) => {
      console.error("[completeExportInspection] 오류:", error);
      throw new Error("수출 검사 처리에 실패했습니다.");
    },
  });

  // ========== 화물 정보 수정 ==========
  const updateWarehouseStock = useMutation({
    mutationFn: (data) => warehouseApi.updateWarehouseStock(data),

    onSuccess: (result, variables) => {
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.warehouse.cargos.detail(variables.stockId),
      });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.warehouse.cargos.all() });
    },

    onError: (error) => {
      console.error("[updateWarehouseStock] 오류:", error);
      throw new Error("화물 정보 수정에 실패했습니다.");
    },
  });

  return {
    createCargoEntry,
    updateCargoLocation,
    completeImportInspection,
    completeExportInspection,
    updateWarehouseStock,
  };
};

export default useWarehouseMutations;
