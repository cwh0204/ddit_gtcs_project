// src/domain/customs/import/importMapper.js

//Import 도메인 통합
import { FIELD_LABELS } from "./mapper/labels";
import { toListItem, toDetailModel, toItemModel, fromFormData } from "./mapper/converters";
import {
  formatDateTime,
  formatDate,
  calculateStatusCounts,
  calculateUrgentCount,
  calculateRiskLevelCounts,
  calculateOfficerCounts,
} from "./mapper/utils";

export * from "./importConstants";

export const importMapper = {
  toListItem,
  toDetailModel,
  toItemModel,
  fromFormData,
};

export const mapImportDeclarationList = (dtoList) => {
  if (!Array.isArray(dtoList)) {
    console.warn("[importMapper] dtoList가 배열이 아닙니다.");
    return [];
  }
  return dtoList.map(toListItem).filter(Boolean);
};

export { FIELD_LABELS, formatDateTime, formatDate, calculateStatusCounts, calculateUrgentCount, calculateRiskLevelCounts, calculateOfficerCounts };

export default importMapper;
