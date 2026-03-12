// src/domain/warehouse/warehouseMapper.js

/**
 * Warehouse Mapper 통합 파일
 * Import/Export와 동일한 패턴
 */

// Mapper 함수들 import
import { FIELD_LABELS } from "./mapper/labels";

import {
  mapWarehouseStats,
  mapZone,
  mapZoneList,
  mapCargo,
  mapCargoList,
  mapInspection,
  mapInspectionList,
  mapException,
  mapExceptionList,
  mapWarehouseCargoToImportDeclaration,
  mapWarehouseCargoToExportDeclaration,
} from "./mapper/converters";

import {
  formatDate,
  calculateDwellTime,
  getDwellTimeText,
  isOverdue,
  calculateDaysUntil,
  calculateWaitingTime,
  getWaitingTimeText,
  calculateProgressTime,
  getProgressTimeText,
  isInspectionDelayed,
  calculateElapsedTime,
  getElapsedTimeText,
} from "./mapper/utils";

// Constants 재export
export * from "./warehouseConstants";

// warehouseMapper 객체 생성
export const warehouseMapper = {
  // 변환 함수들
  mapWarehouseStats,
  mapZone,
  mapZoneList,
  mapCargo,
  mapCargoList,
  mapInspection,
  mapInspectionList,
  mapException,
  mapExceptionList,
  mapWarehouseCargoToImportDeclaration,
  mapWarehouseCargoToExportDeclaration,
};

// 개별 export (기존 코드 호환성)
export {
  FIELD_LABELS,
  mapWarehouseStats,
  mapZone,
  mapZoneList,
  mapCargo,
  mapCargoList,
  mapInspection,
  mapInspectionList,
  mapException,
  mapExceptionList,
  mapWarehouseCargoToImportDeclaration,
  mapWarehouseCargoToExportDeclaration,
  formatDate,
  calculateDwellTime,
  getDwellTimeText,
  isOverdue,
  calculateDaysUntil,
  calculateWaitingTime,
  getWaitingTimeText,
  calculateProgressTime,
  getProgressTimeText,
  isInspectionDelayed,
  calculateElapsedTime,
  getElapsedTimeText,
};

// default export
export default warehouseMapper;
