// src/domain/warehouse/constants/status.js

/**
 * 창고관리자 상태 정의
 */

// 신고서 상태 (Import/Export Master 공통)
export const DECLARATION_STATUSES = {
  // 보세 입고
  BONDED_IN: "BONDED_IN", // 보세 입고 완료

  // 세관 심사
  WAITING: "WAITING", // 심사 대기
  PHYSICAL: "PHYSICAL", // 현품 검사 중
  SUPPLEMENT: "SUPPLEMENT", // 보완/정정
  REVIEWING: "REVIEWING", // 심사 중
  ACCEPTED: "ACCEPTED", // 수리
  REJECTED: "REJECTED", // 반출 차단
  ESCALATED: "ESCALATED", // 결재요청

  // 납부
  PAY_WAITING: "PAY_WAITING", // 납부 대기
  PAY_COMPLETED: "PAY_COMPLETED", // 납부 완료

  // 창고 관리
  WH_IN_APPROVED: "WH_IN_APPROVED", // 국내 창고 반입 승인
  WH_IN_REJECTED: "WH_IN_REJECTED", // 국내 창고 반입 차단
  RELEASE_APPROVED: "RELEASE_APPROVED", // 보세 창고 반출 승인
  RELEASE_REJECTED: "RELEASE_REJECTED", // 보세 창고 반출 차단

  //검사 완료 (창고관리자가 설정)
  INSPECTION_COMPLETED: "INSPECTION_COMPLETED", // 검사 완료

  // 최종 승인
  APPROVED: "APPROVED", // 통관 승인
};

// 화물 상태 (DECLARATION_STATUSES와 동일)
export const CARGO_STATUSES = DECLARATION_STATUSES;

export const STATUS_LABELS = {
  // 보세 입고
  BONDED_IN: "보세입고",

  // 세관 심사
  WAITING: "심사대기",
  PHYSICAL: "검사중",
  SUPPLEMENT: "보완/정정",
  REVIEWING: "심사중",
  ACCEPTED: "수리",
  REJECTED: "반출차단",
  ESCALATED: "결재요청",

  // 납부
  PAY_WAITING: "납부대기",
  PAY_COMPLETED: "납부완료",

  // 창고 관리
  WH_IN_APPROVED: "반입승인",
  WH_IN_REJECTED: "반입차단",
  RELEASE_APPROVED: "반출승인",
  RELEASE_REJECTED: "반출차단",

  //검사 완료
  INSPECTION_COMPLETED: "검사완료",

  // 최종 승인
  APPROVED: "통관승인",
  DELIVERED: "출고완료",
};
// 상태별 Badge 색상 변형
export const STATUS_BADGE_VARIANTS = {
  // 보세 입고
  BONDED_IN: "default",

  // 세관 심사
  WAITING: "warning",
  PHYSICAL: "warning",
  SUPPLEMENT: "warning",
  REVIEWING: "primary",
  ACCEPTED: "success",
  REJECTED: "danger",
  ESCALATED: "warning",

  // 납부
  PAY_WAITING: "warning",
  PAY_COMPLETED: "success",

  // 창고 관리
  WH_IN_APPROVED: "success",
  WH_IN_REJECTED: "danger",
  RELEASE_APPROVED: "success",
  RELEASE_REJECTED: "danger",

  //검사 완료
  INSPECTION_COMPLETED: "success",

  // 최종 승인
  APPROVED: "success",
  DELIVERED: "success",
};
// 구역 상태

export const ZONE_LIST = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

export const ZONE_STATUSES = {
  NORMAL: "normal",
  WARNING: "warning",
  FULL: "full",
};

export const ZONE_STATUS_LABELS = {
  normal: "정상",
  warning: "주의",
  full: "만석",
};

export const ZONE_STATUS_COLORS = {
  normal: "success",
  warning: "warning",
  full: "danger",
};

// 검사 상태 매핑 (하위 호환성)
export const INSPECTION_STATUSES = {
  WAITING: "WAITING", // 심사 대기
  IN_PROGRESS: "PHYSICAL", // 검사 진행중
  COMPLETED: "INSPECTION_COMPLETED", // 검사 완료
  FAILED: "REJECTED", // 반출 차단
};

export const INSPECTION_STATUS_LABELS = {
  WAITING: "대기중",
  PHYSICAL: "진행중",
  INSPECTION_COMPLETED: "완료",
  REJECTED: "차단",
};

export const INSPECTION_STATUS_COLORS = {
  WAITING: "warning",
  PHYSICAL: "primary",
  INSPECTION_COMPLETED: "success",
  REJECTED: "danger",
};
// API 응답 코드
export const API_RESPONSE_CODE = {
  SUCCESS: 1,
  FAILURE: 2,
};
// 상태 전환 규칙

/**
 * 창고관리자가 수행 가능한 상태 전환
 */
export const STATUS_TRANSITIONS = {
  // PHYSICAL (검사중) 상태에서 검사 완료/차단
  PHYSICAL: {
    canTransitionTo: ["INSPECTION_COMPLETED", "REJECTED"],
    actions: {
      complete: "INSPECTION_COMPLETED", //검사 완료
      block: "REJECTED", //반출 차단
    },
  },

  //PAY_COMPLETED (납부완료) 상태에서 반출 승인/차단
  PAY_COMPLETED: {
    canTransitionTo: ["RELEASE_APPROVED", "RELEASE_REJECTED"],
    actions: {
      approve: "RELEASE_APPROVED", //반출 승인
      block: "RELEASE_REJECTED", //반출 차단
    },
  },
};

/**
 * 상태별 검사 가능 여부 (PHYSICAL 상태)
 */
export const canInspect = (status) => {
  return status === DECLARATION_STATUSES.PHYSICAL;
};

/**
 * 상태별 검사 완료 가능 여부
 */
export const canCompleteInspection = (status) => {
  return status === DECLARATION_STATUSES.PHYSICAL;
};

/**
 * 상태별 반출 차단 가능 여부 (PHYSICAL 상태)
 */
export const canBlockRelease = (status) => {
  return status === DECLARATION_STATUSES.PHYSICAL;
};

/**
 *상태별 반출 처리 가능 여부 (PAY_COMPLETED 상태)
 */
export const canProcessRelease = (status) => {
  return status === DECLARATION_STATUSES.PAY_COMPLETED;
};

/**
 *상태별 반출 승인 가능 여부
 */
export const canApproveRelease = (status) => {
  return status === DECLARATION_STATUSES.PAY_COMPLETED;
};

/**
 *상태별 반출 거부 가능 여부
 */
export const canRejectRelease = (status) => {
  return status === DECLARATION_STATUSES.PAY_COMPLETED;
};
