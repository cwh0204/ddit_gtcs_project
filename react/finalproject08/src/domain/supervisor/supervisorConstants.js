// src/domain/supervisor/supervisorConstants.js

// ========================================
// 결재 상태
// ========================================
export const APPROVAL_STATUS = {
  APPROVAL_REQUESTED: "APPROVAL_REQUESTED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  APPROVAL_CLOSED: "APPROVAL_CLOSED",
};

export const APPROVAL_STATUS_LABELS = {
  // ========== 결재 상태 ==========
  APPROVAL_REQUESTED: "결재 대기",
  APPROVAL_CLOSED: "종결",
  ESCALATED: "결재대기",
  ACCEPTED: "승인 완료",

  // ========== 수입 상태 (백엔드 동기화) ==========
  BONDED_IN: "입고완료",
  WAITING: "심사대기",
  REVIEWING: "심사중",
  PHYSICAL: "현품검사중",
  INSPECTION_COMPLETED: "검사완료",
  SUPPLEMENT: "보완/정정",
  ACCEPTED: "수리",
  REJECTED: "반려",
  PAY_WAITING: "납부 대기",
  PAY_COMPLETED: "납부 완료",
  WH_IN_APPROVED: "반입승인",
  WH_IN_REJECTED: "반입차단",
  RELEASE_APPROVED: "반출승인",
  RELEASE_REJECTED: "반출차단",
  APPROVED: "통관승인",
  DELIVERED: "출고 완료",

  // ========== 공통 상태 ==========
  PENDING: "접수 대기",
  RECEIVED: "접수 완료",
  COMPLETED: "결재완료",
  CANCELLED: "취소",

  // ========== 기존 코드 (하위 호환) ==========
  PENDING_REVIEW: "심사대기",
  UNDER_REVIEW: "심사중",
  INSPECTION: "현품검사중",
  SUPPLEMENT_REQUESTED: "보완/정정",
  CORRECTION_REQUESTED: "보완/정정",
};

export const APPROVAL_STATUS_BADGE_VARIANTS = {
  // ========== 결재 상태 ==========
  APPROVAL_REQUESTED: "warning",
  APPROVAL_CLOSED: "outline",
  ESCALATED: "warning",
  ACCEPTED: "success",

  // ========== 수입 상태 (백엔드 동기화) ==========
  BONDED_IN: "primary",
  WAITING: "warning",
  REVIEWING: "primary",
  PHYSICAL: "primary",
  INSPECTION_COMPLETED: "success",
  SUPPLEMENT: "warning",
  ACCEPTED: "success",
  REJECTED: "danger",
  PAY_WAITING: "warning",
  PAY_COMPLETED: "success",
  WH_IN_APPROVED: "success",
  WH_IN_REJECTED: "danger",
  RELEASE_APPROVED: "success",
  RELEASE_REJECTED: "danger",
  APPROVED: "success",
  DELIVERED: "success",

  // ========== 공통 상태 ==========
  PENDING: "outline",
  RECEIVED: "primary",
  COMPLETED: "success",
  CANCELLED: "outline",

  // ========== 기존 코드 (하위 호환) ==========
  PENDING_REVIEW: "warning",
  UNDER_REVIEW: "primary",
  INSPECTION: "primary",
  SUPPLEMENT_REQUESTED: "warning",
  CORRECTION_REQUESTED: "warning",
};

export const APPROVAL_STATUS_OPTIONS = [
  { value: "ALL", label: "전체 (결재대기)" },
  { value: "ESCALATED", label: "결재대기" },
  { value: "COMPLETED", label: "결재완료" },
];

// 결재 목록 전용 상태 레이블 (ESCALATED→대기, ACCEPTED→승인, REJECTED→반려)
export const APPROVAL_DECISION_LABELS = {
  ESCALATED: "결재대기",
  ACCEPTED: "결재승인",
  REJECTED: "결재반려",
};

export const APPROVAL_DECISION_BADGE_VARIANTS = {
  ESCALATED: "warning",
  ACCEPTED: "success",
  REJECTED: "danger",
};

// ========================================
// 결재 유형
// ========================================
export const APPROVAL_TYPE_LABELS = {
  // ApprovalListPage 결재 유형
  HIGH_RISK: "고위험 승인",
  HIGH_AMOUNT: "고액 수리",
  EXCEPTION: "예외 승인",
  GENERAL: "일반 결재",
  // 기존 호환
  NORMAL: "일반 결재",
  HIGH_RISK_IMPORT: "고액 수리",
  STRATEGIC_EXPORT: "전략물자",
  URGENT: "긴급",
  IMPORT: "수입",
  EXPORT: "수출",
};

// ========================================
// 채널 색상 (대시보드)
// ========================================
export const CHANNEL_COLORS = {
  GREEN: "#22c55e",
  DOC: "#3b82f6",
  RED: "#ef4444",
  ANALYSIS: "#f59e0b",
};

// ========================================
// 대시보드 KPI 설정
// ========================================
export const DASHBOARD_KPI_CONFIG = {
  pendingApproval: { label: "결재 대기", color: "amber" },
  slaDelayed: { label: "SLA 초과", color: "red" },
  highRisk: { label: "고위험", color: "orange" },
  todayApproved: { label: "오늘 승인", color: "green" },
};

// ========================================
// 배정 관리
// ========================================
export const ASSIGNMENT_WORK_TYPE = {
  IMPORT: "IMPORT",
  EXPORT: "EXPORT",
};

export const ASSIGNMENT_WORK_TYPE_LABELS = {
  IMPORT: "수입 통관",
  EXPORT: "수출 통관",
};

export const ASSIGNMENT_WORK_TYPE_OPTIONS = [
  { value: "ALL", label: "전체" },
  { value: "IMPORT", label: "수입 통관" },
  { value: "EXPORT", label: "수출 통관" },
];

export const ASSIGNMENT_PRIORITY_LABELS = {
  HIGH: "긴급",
  MEDIUM: "보통",
  LOW: "일반",
};

export const ASSIGNMENT_PRIORITY_BADGE = {
  HIGH: "danger",
  MEDIUM: "warning",
  LOW: "outline",
};

// ========================================
// 세관원 부하 상태
// ========================================
export const OFFICER_LOAD_STATUS = {
  LOW: { label: "여유", color: "text-green-600", bgColor: "bg-green-500" },
  MEDIUM: { label: "보통", color: "text-yellow-600", bgColor: "bg-yellow-500" },
  HIGH: { label: "과부하", color: "text-red-600", bgColor: "bg-red-500" },
};

export const getOfficerLoadLevel = (taskLoad = 0) => {
  if (taskLoad <= 5) return "LOW";
  if (taskLoad <= 15) return "MEDIUM";
  return "HIGH";
};

export const getOfficerLoadPercent = (taskLoad = 0) => {
  const MAX_LOAD = 30;
  return Math.min(Math.round((taskLoad / MAX_LOAD) * 100), 100);
};

// ========================================
// 적체/지연 모니터링 (mock 기반)
// ========================================
export const BACKLOG_STAGE_LABELS = {
  // STAGE_KEY_MAP 변환 후 값
  RECEPTION: "접수",
  DOC_REVIEW: "서류심사",
  PHYSICAL_INSPECT: "물품검사",
  TAX_REVIEW: "세액심사",
  RELEASE: "반출승인",
  // raw status 직접 표시 fallback (STAGE_KEY_MAP에 없는 상태)
  WAITING: "접수대기",
  REVIEWING: "서류심사",
  PHYSICAL: "물품검사",
  INSPECTION: "물품검사",
  INSPECTION_COMPLETED: "검사완료",
  PAY_WAITING: "납부대기",
  PAY_COMPLETED: "납부완료",
  ACCEPTED: "세액심사",
  RELEASE_APPROVED: "반출승인",
  SUPPLEMENT: "보완/정정",
  ESCALATED: "결재요청",
  APPROVED: "승인",
  REJECTED: "반려",
  CLEARED: "통관완료",
  DELIVERED: "출고완료",
  NOTICE_ISSUED: "고지서발부",
  WH_IN_REJECTED: "반입차단",
  RELEASE_REJECTED: "반출차단",
};

export const BACKLOG_STAGE_COLORS = {
  // STAGE_KEY_MAP 변환 후 값
  RECEPTION: "#3b82f6",
  DOC_REVIEW: "#8b5cf6",
  PHYSICAL_INSPECT: "#f59e0b",
  TAX_REVIEW: "#ef4444",
  RELEASE: "#22c55e",
  // raw status fallback
  WAITING: "#3b82f6",
  REVIEWING: "#8b5cf6",
  PHYSICAL: "#f59e0b",
  INSPECTION: "#f59e0b",
  INSPECTION_COMPLETED: "#10b981",
  PAY_WAITING: "#f97316",
  PAY_COMPLETED: "#22c55e",
  ACCEPTED: "#ef4444",
  RELEASE_APPROVED: "#22c55e",
  SUPPLEMENT: "#a855f7",
  ESCALATED: "#f97316",
  APPROVED: "#22c55e",
  REJECTED: "#dc2626",
  CLEARED: "#6b7280",
  DELIVERED: "#6b7280",
  NOTICE_ISSUED: "#ef4444",
  WH_IN_REJECTED: "#dc2626",
  RELEASE_REJECTED: "#dc2626",
};

export const SLA_HOURS = {
  RECEPTION: 4,
  DOC_REVIEW: 8,
  PHYSICAL_INSPECT: 24,
  TAX_REVIEW: 12,
  RELEASE: 2,
};

export const PERIOD_OPTIONS = [
  { value: "today", label: "오늘" },
  { value: "week", label: "최근 1주" },
  { value: "month", label: "최근 1개월" },
  { value: "quarter", label: "최근 3개월" },
];

// ========================================
// 예외승인/차단해제 (mock 기반)
// ========================================
export const EXCEPTION_RELEASE_REASONS = [
  { value: "URGENT_CARGO", label: "긴급 화물" },
  { value: "DOC_SUPPLEMENT", label: "서류 보완 완료" },
  { value: "RISK_CLEARED", label: "위험 해소 확인" },
  { value: "SUPERVISOR_OVERRIDE", label: "상급자 판단" },
  { value: "SYSTEM_ERROR", label: "시스템 오류 보정" },
  { value: "OTHER", label: "기타" },
];

// ========================================
// 반려 사유 (결재)
// ========================================
export const SUPERVISOR_REJECT_REASONS = [
  { value: "DOC_INCOMPLETE", label: "서류 미비" },
  { value: "PRICE_MISMATCH", label: "가격 불일치" },
  { value: "HS_CODE_ERROR", label: "HS코드 오류" },
  { value: "REGULATION_VIOLATION", label: "규제 위반" },
  { value: "NEED_REINSPECTION", label: "재검사 필요" },
  { value: "OTHER", label: "기타" },
];

// ========================================
// 결재 유형 — ApprovalListPage용 추가 키
// ========================================
// APPROVAL_TYPE_LABELS에 없는 키 보완
export const APPROVAL_TYPE_LABELS_EXTENDED = {
  ...APPROVAL_TYPE_LABELS,
  HIGH_RISK: "고위험 승인",
  HIGH_AMOUNT: "고액 수리",
  EXCEPTION: "예외 승인",
  GENERAL: "일반 결재",
};

export const APPROVAL_TYPE_BADGE_VARIANTS = {
  HIGH_RISK: "danger",
  HIGH_AMOUNT: "warning",
  EXCEPTION: "primary",
  GENERAL: "default",
  NORMAL: "default",
  HIGH_RISK_IMPORT: "warning",
  STRATEGIC_EXPORT: "danger",
  URGENT: "danger",
  IMPORT: "primary",
  EXPORT: "success",
};

// ========================================
// AI 위험도 채널
// ========================================
export const RISK_CHANNEL_LABELS = {
  RED: "RED (고위험)",
  YELLOW: "YELLOW (주의)",
  GREEN: "GREEN (저위험)",
  DOC: "서류심사",
  ANALYSIS: "분석 중",
};

export const RISK_CHANNEL_BADGE_VARIANTS = {
  RED: "danger",
  YELLOW: "warning",
  GREEN: "success",
  DOC: "primary",
};
