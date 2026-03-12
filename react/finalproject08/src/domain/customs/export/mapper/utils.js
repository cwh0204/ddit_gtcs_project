// src/domain/customs/export/mapper/utils.js

/**
 * Export Mapper 유틸리티 함수
 * Import와 동일한 패턴
 */

import { formatDate as formatDateTime, formatDateOnly as formatDate, formatAmount, formatCurrency } from "../../../../utils/formatters";

// 날짜 포맷 함수 재export
export { formatDateTime, formatDate, formatAmount, formatCurrency };

/**
 * 상태별 건수 계산
 */
export const calculateStatusCounts = (dataList) => {
  if (!Array.isArray(dataList)) return { total: 0 };

  const counts = {
    total: dataList.length,
    PENDING_REVIEW: 0,
    UNDER_REVIEW: 0,
    AGENCY_REVIEW: 0,
    SUPPLEMENT_REQUESTED: 0,
    SUPPLEMENT_SUBMITTED: 0,
    SUPPLEMENT_REVIEW: 0,
    CORRECTION_REQUESTED: 0,
    CORRECTION_SUBMITTED: 0,
    CORRECTION_REVIEW: 0,
    INSPECTION: 0,
    INSPECTION_COMPLETED: 0,
    CLEARED: 0,
    RELEASE_APPROVED: 0,
    APPROVED: 0,
    INVESTIGATION_HOLD: 0,
    REJECTED: 0,
  };

  dataList.forEach((item) => {
    const status = item.status;
    if (counts.hasOwnProperty(status)) {
      counts[status]++;
    }
  });

  return counts;
};

/**
 * 긴급 건수 계산
 */
export const calculateUrgentCount = (dataList) => {
  if (!Array.isArray(dataList)) return 0;
  return dataList.filter((item) => item.isUrgent === true || item.isUrgent === "Y").length;
};

/**
 * 위험도별 건수 계산
 */
export const calculateRiskLevelCounts = (dataList) => {
  if (!Array.isArray(dataList)) return { RED: 0, GREEN: 0 };

  const counts = { RED: 0, GREEN: 0 };

  dataList.forEach((item) => {
    // mapRiskLevel 로직과 동일
    const level = item.riskResult;
    const score = item.docScore;
    let risk;

    if (level && (level === "HIGH" || level === "RED")) {
      risk = "RED";
    } else if (typeof score === "number" && score < 80) {
      risk = "RED";
    } else {
      risk = "GREEN";
    }

    if (counts.hasOwnProperty(risk)) {
      counts[risk]++;
    }
  });

  return counts;
};

/**
 * 담당자별 배정 건수 계산
 */
export const calculateOfficerCounts = (dataList) => {
  if (!Array.isArray(dataList)) return {};

  const counts = {};

  dataList.forEach((item) => {
    const officer = item.assignedOfficer;
    if (officer && officer !== "-") {
      counts[officer] = (counts[officer] || 0) + 1;
    }
  });

  return counts;
};
