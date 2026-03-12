// src/domain/customs/import/constants/status.js

/**
 * ✅ 수입신고 상태 정의 (백엔드 완전 동기화)
 *
 * ⭐ 원칙: 백엔드 상태 코드를 Primary로 사용
 * - WAITING (심사대기)
 * - REVIEWING (심사중)
 * - PHYSICAL (현품검사중)
 * - INSPECTION_COMPLETED (검사완료) ⭐ 추가
 * - SUPPLEMENT (보완/정정)
 * - ACCEPTED (수리)
 * - REJECTED (반려)
 * - ESCALATED (결재요청) ⭐ 추가
 * - PAY_WAITING (납부 대기)
 * - PAY_COMPLETED (납부 완료)
 */

export const IMPORT_STATUSES = {
  // ========== 백엔드 Primary 상태 ==========
  BONDED_IN: "BONDED_IN", // (보세)입고완료
  WAITING: "WAITING", // 심사대기
  REVIEWING: "REVIEWING", // 심사중
  PHYSICAL: "PHYSICAL", // (현품)검사중
  INSPECTION_COMPLETED: "INSPECTION_COMPLETED", // ⭐ 검사완료 (창고관리자가 설정)
  SUPPLEMENT: "SUPPLEMENT", // 보완/정정
  ACCEPTED: "ACCEPTED", // 수리 (고지서 발송 트리거)
  REJECTED: "REJECTED", // 반려
  ESCALATED: "ESCALATED", // ⭐ 결재요청 (상급자에게 결재 요청)

  // ========== 납부 관련 ==========
  PAY_WAITING: "PAY_WAITING", // 납부 대기
  PAY_COMPLETED: "PAY_COMPLETED", // 납부 완료

  // ========== 창고 관련 ==========
  WH_IN_APPROVED: "WH_IN_APPROVED", // 반입승인
  WH_IN_REJECTED: "WH_IN_REJECTED", // 반입차단
  RELEASE_APPROVED: "RELEASE_APPROVED", // 반출승인
  RELEASE_REJECTED: "RELEASE_REJECTED", // 반출차단
  APPROVED: "APPROVED", // 통관승인
  DELIVERED: "DELIVERED", // 출고 완료

  // ========== 기존 코드 (하위 호환용) ==========
  PENDING_REVIEW: "WAITING", // → WAITING으로 매핑
  UNDER_REVIEW: "REVIEWING", // → REVIEWING으로 매핑
  INSPECTION: "PHYSICAL", // → PHYSICAL로 매핑
  SUPPLEMENT_REQUESTED: "SUPPLEMENT", // → SUPPLEMENT로 매핑
  CORRECTION_REQUESTED: "SUPPLEMENT", // → SUPPLEMENT로 매핑
};

// 상태 라벨 (한글)
export const STATUS_LABELS = {
  BONDED_IN: "입고완료",
  WAITING: "심사대기",
  REVIEWING: "심사중",
  PHYSICAL: "현품검사중",
  INSPECTION_COMPLETED: "검사완료",
  SUPPLEMENT: "보완/정정",
  ACCEPTED: "수리",
  REJECTED: "반려",
  ESCALATED: "결재 요청",
  PAY_WAITING: "납부 대기",
  PAY_COMPLETED: "납부 완료",
  WH_IN_APPROVED: "반입승인",
  WH_IN_REJECTED: "반입차단",
  RELEASE_APPROVED: "반출승인",
  RELEASE_REJECTED: "반출차단",
  APPROVED: "통관승인",
  DELIVERED: "출고 완료",

  // ========== 기존 코드 (하위 호환) ==========
  PENDING_REVIEW: "심사대기",
  UNDER_REVIEW: "심사중",
  INSPECTION: "(현품)검사중",
  SUPPLEMENT_REQUESTED: "보완/정정",
  CORRECTION_REQUESTED: "보완/정정",
};

// 상태별 Badge 색상
export const STATUS_BADGE_VARIANTS = {
  // ========== Primary 상태 ==========
  BONDED_IN: "primary",
  WAITING: "warning",
  REVIEWING: "primary",
  PHYSICAL: "primary",
  INSPECTION_COMPLETED: "success",
  SUPPLEMENT: "warning",
  ACCEPTED: "success",
  REJECTED: "danger",
  ESCALATED: "warning", // ⭐ 추가 - 주황색

  // ========== 납부 관련 ==========
  PAY_WAITING: "warning",
  PAY_COMPLETED: "success",

  // ========== 창고 관련 ==========
  WH_IN_APPROVED: "success",
  WH_IN_REJECTED: "danger",
  RELEASE_APPROVED: "success",
  RELEASE_REJECTED: "danger",
  APPROVED: "success",
  DELIVERED: "success",

  // ========== 기존 코드 (하위 호환) ==========
  PENDING_REVIEW: "warning",
  UNDER_REVIEW: "primary",
  INSPECTION: "primary",
  SUPPLEMENT_REQUESTED: "warning",
  CORRECTION_REQUESTED: "warning",
};

/**
 * 상태 전환 규칙
 */
export const STATUS_TRANSITIONS = {
  WAITING: ["REVIEWING", "PHYSICAL", "SUPPLEMENT", "REJECTED"],
  REVIEWING: ["PHYSICAL", "SUPPLEMENT", "ACCEPTED", "REJECTED", "ESCALATED"], // ⭐ ESCALATED 추가
  PHYSICAL: ["INSPECTION_COMPLETED", "REVIEWING", "SUPPLEMENT", "REJECTED"],
  INSPECTION_COMPLETED: ["ACCEPTED", "REJECTED"],
  SUPPLEMENT: ["WAITING", "REVIEWING", "REJECTED"],
  ESCALATED: ["ACCEPTED", "REJECTED"], // ⭐ 결재요청 후 승인/반려
  ACCEPTED: ["PAY_WAITING"],
  PAY_WAITING: ["PAY_COMPLETED"],
  PAY_COMPLETED: ["WH_IN_APPROVED", "WH_IN_REJECTED"],
};

/**
 * 백엔드 상태 코드 변환 (필요시)
 */
export const normalizeStatus = (status) => {
  const statusMap = {
    PENDING_REVIEW: "WAITING",
    UNDER_REVIEW: "REVIEWING",
    INSPECTION: "PHYSICAL",
    SUPPLEMENT_REQUESTED: "SUPPLEMENT",
    CORRECTION_REQUESTED: "SUPPLEMENT",
  };

  return statusMap[status] || status;
};
