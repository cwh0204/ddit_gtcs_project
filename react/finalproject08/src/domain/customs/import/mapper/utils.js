//src/domain/customs/import/mapper/utils.js

import { formatDate as formatDateTime, formatDateOnly as formatDate } from "../../../../utils/formatters";

export { formatDateTime, formatDate };

//상태별 건수 계산

export const calculateStatusCounts = (dtoList) => {
  if (!Array.isArray(dtoList)) return { total: 0 };

  const counts = { total: dtoList.length };

  dtoList.forEach((dto) => {
    const status = dto.status;
    if (status) {
      counts[status] = (counts[status] || 0) + 1;
    }
  });

  return counts;
};

//긴급 건수 계산

export const calculateUrgentCount = (dtoList) => {
  if (!Array.isArray(dtoList)) return 0;

  return dtoList.filter((dto) => dto.isUrgent === true || dto.audit?.isUrgent === true).length;
};

//위험도별 건수 계산
export const calculateRiskLevelCounts = (dtoList) => {
  if (!Array.isArray(dtoList)) {
    return { LOW: 0, MEDIUM: 0, HIGH: 0 };
  }

  const counts = { LOW: 0, MEDIUM: 0, HIGH: 0 };

  dtoList.forEach((dto) => {
    // 값이 없으면 기본값 MEDIUM으로 처리
    const riskLevel = dto.riskLevel || "MEDIUM";

    if (counts.hasOwnProperty(riskLevel)) {
      counts[riskLevel]++;
    }
  });

  return counts;
};

//담당자별 배정 건수 계산
export const calculateOfficerCounts = (dtoList) => {
  if (!Array.isArray(dtoList)) return {};

  const counts = {};

  dtoList.forEach((dto) => {
    const officer = dto.assignedOfficer || dto.audit?.assignedOfficer;

    if (officer && officer !== "미배정") {
      counts[officer] = (counts[officer] || 0) + 1;
    }
  });

  return counts;
};
