// src/domain/customs/export/constants/status.js

/**
 * 수출신고 상태 정의
 * ⭐ 실제 백엔드 상태코드와 일치하도록 수정
 */

// ========================================
// 기본 상태 코드
// ========================================

export const EXPORT_STATUSES = {
  // 보세/공통
  BONDED_IN: "BONDED_IN", // 보세입고완료

  // 심사 단계
  WAITING: "WAITING", // 심사대기
  REVIEWING: "REVIEWING", // 심사중
  PHYSICAL: "PHYSICAL", // 현품검사중
  SUPPLEMENT: "SUPPLEMENT", // 보완/정정

  // 수리/반려
  ACCEPTED: "ACCEPTED", // 수리
  REJECTED: "REJECTED", // 반려

  // 납부/환급
  PAY_WAITING: "PAY_WAITING", // 환급대기
  PAY_COMPLETED: "PAY_COMPLETED", // 환급완료

  // 창고 단계 (백엔드 실제 코드와 일치)
  WH_IN_APPROVED: "WH_IN_APPROVED", // 반입승인
  WH_IN_REJECTED: "WH_IN_REJECTED", // 반입차단
  RELEASE_APPROVED: "RELEASE_APPROVED", // 반출승인 ✅
  RELEASE_REJECTED: "RELEASE_REJECTED", // 반출차단 ✅

  // 최종
  APPROVED: "APPROVED", // 통관승인

  // ========================================
  // 하위 호환성 (기존 코드 지원)
  // ========================================
  PENDING_REVIEW: "WAITING",
  UNDER_REVIEW: "REVIEWING",
  INSPECTION: "PHYSICAL",
  SUPPLEMENT_REQUESTED: "SUPPLEMENT",
  CORRECTION_REQUESTED: "SUPPLEMENT",
  INSPECTION_COMPLETED: "PHYSICAL",
  CLEARED: "ACCEPTED",
  WH_OUT_APPROVED: "RELEASE_APPROVED", // 구 코드 → 새 코드 매핑
  WH_OUT_REJECTED: "RELEASE_REJECTED", // 구 코드 → 새 코드 매핑
};

// ========================================
// 상태 라벨 (한글)
// ========================================

export const STATUS_LABELS = {
  // ========== Primary 상태 ==========
  BONDED_IN: "입고완료",
  WAITING: "심사대기",
  REVIEWING: "심사중",
  PHYSICAL: "현품검사중",
  INSPECTION_COMPLETED: "검사완료", // ⭐ 추가
  SUPPLEMENT: "보완/정정",
  ACCEPTED: "수리",
  REJECTED: "반려",

  // ========== 창고 관련 ==========
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

  // 하위 호환성
  PENDING_REVIEW: "심사대기",
  UNDER_REVIEW: "심사중",
  INSPECTION: "현품검사중",
  SUPPLEMENT_REQUESTED: "보완/정정",
  CORRECTION_REQUESTED: "보완/정정",
  INSPECTION_COMPLETED: "현품검사완료",
  CLEARED: "수리",
  WH_OUT_APPROVED: "반출승인",
  WH_OUT_REJECTED: "반출차단",
};

// ========================================
// Badge 색상
// ========================================

export const STATUS_BADGE_VARIANTS = {
  // 대기 (warning - 주황)
  BONDED_IN: "default",
  WAITING: "warning",
  SUPPLEMENT: "warning",
  PAY_WAITING: "warning",

  // 진행중 (primary - 파랑)
  REVIEWING: "primary",
  PHYSICAL: "primary",

  // 완료/승인 (success - 초록)
  ACCEPTED: "success",
  PAY_COMPLETED: "success",
  WH_IN_APPROVED: "success",
  RELEASE_APPROVED: "success",
  APPROVED: "success",

  // 반려/차단 (danger - 빨강)
  REJECTED: "danger",
  WH_IN_REJECTED: "danger",
  RELEASE_REJECTED: "danger",

  // 하위 호환성
  PENDING_REVIEW: "warning",
  UNDER_REVIEW: "primary",
  INSPECTION: "primary",
  SUPPLEMENT_REQUESTED: "warning",
  CORRECTION_REQUESTED: "warning",
  INSPECTION_COMPLETED: "primary",
  CLEARED: "success",
  WH_OUT_APPROVED: "success",
  WH_OUT_REJECTED: "danger",
};

// ========================================
// 상태 정규화 헬퍼
// ========================================

/**
 * 기존/구버전 상태 코드를 현재 코드로 변환
 */
export const normalizeStatus = (status) => {
  const statusMap = {
    PENDING_REVIEW: "WAITING",
    UNDER_REVIEW: "REVIEWING",
    INSPECTION: "PHYSICAL",
    SUPPLEMENT_REQUESTED: "SUPPLEMENT",
    CORRECTION_REQUESTED: "SUPPLEMENT",
    INSPECTION_COMPLETED: "PHYSICAL",
    CLEARED: "ACCEPTED",
    WH_OUT_APPROVED: "RELEASE_APPROVED",
    WH_OUT_REJECTED: "RELEASE_REJECTED",
  };

  return statusMap[status] || status;
};
