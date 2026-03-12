// src/domain/warehouse/constants/references.js

/**
 * Warehouse 참조 데이터
 * Import/Export와 동일한 패턴
 */

// ========================================
// 색상 테마 (어두운 톤)
// ========================================

export const WAREHOUSE_COLORS = {
  primary: "#1e293b", // 어두운 슬레이트
  secondary: "#475569", // 중간 회색
  accent: "#64748b", // 밝은 회색
  bg: "#f1f5f9", // 밝은 회색 배경
  border: "#cbd5e1", // 회색 테두리
  hover: "#334155", // 호버 색상
};

// ========================================
// 검사 우선순위
// ========================================

export const INSPECTION_PRIORITY = {
  HIGH: "high",
  NORMAL: "normal",
  LOW: "low",
};

export const PRIORITY_LABELS = {
  high: "높음",
  normal: "보통",
  low: "낮음",
};

export const PRIORITY_COLORS = {
  high: "danger",
  normal: "primary",
  low: "default",
};

// ========================================
// 예외 유형
// ========================================

export const EXCEPTION_TYPES = {
  OVERDUE: "overdue", // 체류 기한 초과
  DAMAGE: "damage", // 화물 손상
  MISSING: "missing", // 화물 분실
  MISMATCH: "mismatch", // 정보 불일치
  UNAUTHORIZED: "unauthorized", // 무단 접근
  OTHER: "other", // 기타
};

export const EXCEPTION_TYPE_LABELS = {
  overdue: "체류 초과",
  damage: "손상",
  missing: "분실",
  mismatch: "정보 불일치",
  unauthorized: "무단 접근",
  other: "기타",
};

// ========================================
// 예외 심각도
// ========================================

export const EXCEPTION_SEVERITY = {
  URGENT: "urgent",
  WARNING: "warning",
  NORMAL: "normal",
};

export const SEVERITY_LABELS = {
  urgent: "긴급",
  warning: "주의",
  normal: "일반",
};

export const SEVERITY_COLORS = {
  urgent: "danger",
  warning: "warning",
  normal: "primary",
};

// ========================================
// 예외 상태
// ========================================

export const EXCEPTION_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
};

export const EXCEPTION_STATUS_LABELS = {
  open: "미해결",
  in_progress: "처리중",
  resolved: "해결됨",
};

export const EXCEPTION_STATUS_COLORS = {
  open: "danger",
  in_progress: "warning",
  resolved: "success",
};
