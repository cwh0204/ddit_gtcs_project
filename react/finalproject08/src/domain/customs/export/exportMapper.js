// src/domain/customs/export/exportMapper.js

/**
 * Export Mapper 통합 파일
 * Import의 importMapper.js와 동일한 패턴
 */

// ========================================
// Mapper 함수들 import
// ========================================

import { FIELD_LABELS } from "./mapper/labels";

import {
  mapExportDeclarationListFromAPI,
  mapExportDeclarationList,
  mapExportDeclarationDetailFromAPI,
  mapExportDeclarationToAPI,
} from "./mapper/converters";

import {
  formatDateTime,
  formatDate,
  formatAmount,
  formatCurrency,
  calculateStatusCounts,
  calculateUrgentCount,
  calculateRiskLevelCounts,
  calculateOfficerCounts,
} from "./mapper/utils";

// ========================================
// Constants 재export
// ========================================

export * from "./exportConstants";

// ========================================
// exportMapper 객체 생성
// ========================================

export const exportMapper = {
  // 변환 함수들
  mapExportDeclarationListFromAPI,
  mapExportDeclarationList,
  mapExportDeclarationDetailFromAPI,
  mapExportDeclarationToAPI,

  // 집계 함수들
  calculateStatusCounts,
  calculateUrgentCount,
  calculateRiskLevelCounts,
  calculateOfficerCounts,
};

// ========================================
// 개별 export (기존 코드 호환성)
// ========================================

export {
  FIELD_LABELS,
  formatDateTime,
  formatDate,
  formatAmount,
  formatCurrency,
  calculateStatusCounts,
  calculateUrgentCount,
  calculateRiskLevelCounts,
  calculateOfficerCounts,
  mapExportDeclarationListFromAPI,
  mapExportDeclarationList,
  mapExportDeclarationDetailFromAPI,
  mapExportDeclarationToAPI,
};

// ========================================
// default export
// ========================================

export default exportMapper;
