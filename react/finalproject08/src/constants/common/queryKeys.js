// src/constants/queryKeys.js

export const QUERY_KEYS = {
  warehouse: {
    all: ["warehouse"],

    // 통계
    stats: () => [...QUERY_KEYS.warehouse.all, "stats"],
    dailyStats: (data) => [...QUERY_KEYS.warehouse.all, "dailyStats", data],
    timePatterns: () => [...QUERY_KEYS.warehouse.all, "timePatterns"],

    // 창고 구역
    zones: {
      all: () => [...QUERY_KEYS.warehouse.all, "zones"],
      detail: (zoneId) => [...QUERY_KEYS.warehouse.all, "zones", zoneId],
    },

    //화물 (STOCK 테이블 기반)
    cargos: {
      all: () => [...QUERY_KEYS.warehouse.all, "cargos"],
      list: (filters) => [...QUERY_KEYS.warehouse.all, "cargos", "list", filters],
      detail: (stockId) => [...QUERY_KEYS.warehouse.all, "cargos", "detail", stockId],

      //검색 키
      byContainerNumber: (contNumber) => [...QUERY_KEYS.warehouse.all, "cargos", "container", contNumber],
      byDeclNumber: (declNo) => [...QUERY_KEYS.warehouse.all, "cargos", "declaration", declNo],
      byUniqueNo: (uniqueNo) => [...QUERY_KEYS.warehouse.all, "cargos", "unique", uniqueNo],
      byZone: (zone) => [...QUERY_KEYS.warehouse.all, "cargos", "zone", zone],

      //위치 관련
      byWarehouseId: (warehouseId) => [...QUERY_KEYS.warehouse.all, "cargos", "warehouse", warehouseId],
      byPositionArea: (positionArea) => [...QUERY_KEYS.warehouse.all, "cargos", "area", positionArea],
    },

    //재고 현황
    stock: {
      all: () => [...QUERY_KEYS.warehouse.all, "stock"],
      byZone: (positionArea) => [...QUERY_KEYS.warehouse.all, "stock", "zones", positionArea],
      location: (warehouseId) => [...QUERY_KEYS.warehouse.all, "stock", "location", warehouseId],
    },

    // 검사
    inspections: {
      all: () => [...QUERY_KEYS.warehouse.all, "inspections"],
      queue: () => [...QUERY_KEYS.warehouse.all, "inspections", "queue"],
      byStatus: (status) => [...QUERY_KEYS.warehouse.all, "inspections", "status", status],
    },

    // 예외
    exceptions: {
      all: () => [...QUERY_KEYS.warehouse.all, "exceptions"],
      list: (filters) => [...QUERY_KEYS.warehouse.all, "exceptions", "list", filters],
      detail: (exceptionId) => [...QUERY_KEYS.warehouse.all, "exceptions", "detail", exceptionId],
    },

    // 활동
    activities: {
      all: () => [...QUERY_KEYS.warehouse.all, "activities"],
      recent: (limit) => [...QUERY_KEYS.warehouse.all, "activities", "recent", limit],
      byZone: (zone, limit) => [...QUERY_KEYS.warehouse.all, "activities", "zone", zone, limit],
    },
  },

  // ========== 수입 관련 (기존 패턴 참고용) ==========
  import: {
    all: ["import"],
    declarations: {
      all: () => [...QUERY_KEYS.import.all, "declarations"],
      list: (filters) => [...QUERY_KEYS.import.declarations.all(), "list", filters],
      detail: (declarationId) => [...QUERY_KEYS.import.declarations.all(), "detail", declarationId],
    },
  },

  // ========== 수출 관련 (기존 패턴 참고용) ==========
  export: {
    all: ["export"],
    declarations: {
      all: () => [...QUERY_KEYS.export.all, "declarations"],
      list: (filters) => [...QUERY_KEYS.export.declarations.all(), "list", filters],
      detail: (declarationId) => [...QUERY_KEYS.export.declarations.all(), "detail", declarationId],
    },
  },

  // ========== 세액/납부 관련 (기존 패턴 참고용) ==========
  tax: {
    all: ["tax"],
    payments: {
      all: () => [...QUERY_KEYS.tax.all, "payments"],
      detail: (paymentId) => [...QUERY_KEYS.tax.payments.all(), "detail", paymentId],
    },
  },
};

/**
 * Query Key 유틸리티 함수
 */
export const queryKeyUtils = {
  // 화물 관련 모든 쿼리 무효화
  invalidateAllCargos: (queryClient) => {
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.warehouse.cargos.all(),
    });
  },

  // 특정 구역의 모든 쿼리 무효화
  invalidateZone: (queryClient, zoneId) => {
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.warehouse.zones.detail(zoneId),
    });
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.warehouse.cargos.byZone(zoneId),
    });
  },

  // 통계 관련 모든 쿼리 무효화
  invalidateStats: (queryClient) => {
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.warehouse.stats(),
    });
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.warehouse.all,
    });
  },
};

export const CARGO_ENTRY_INVALIDATION_KEYS = {
  // 입고 성공 시 무효화할 키 목록
  onSuccess: ["warehouse.cargos.all", "warehouse.stock.all", "warehouse.zones.all", "warehouse.stats"],

  // 입고 실패 시 처리
  onError: [],
};
