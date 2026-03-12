// src/domain/customs/export/constants/references.js

/**
 * Export 참조 데이터
 * Import와 유사하지만 Export 특화 데이터 포함
 */

// ========================================
// 채널 타입 (Export 특화)
// ========================================

export const CHANNEL_TYPES = {
  GREEN: "GREEN", // 자동 통과
  DOC: "DOC", // 서류 보완
  ANALYSIS: "ANALYSIS", // 정밀 분석
  RED: "RED", // 현품 검사
};

export const CHANNEL_LABELS = {
  GREEN: "자동통과",
  DOC: "서류보완",
  ANALYSIS: "정밀분석",
  RED: "현품검사",
};

export const CHANNEL_COLORS = {
  GREEN: "success",
  DOC: "warning",
  ANALYSIS: "primary",
  RED: "danger",
};

export const CHANNEL_DESCRIPTIONS = {
  GREEN: "서류 확인 후 즉시 통과",
  DOC: "추가 서류 제출 필요, 보완 후 재검토",
  ANALYSIS: "서류 정밀 분석 필요",
  RED: "현품 확인 필요, 검사 후 판정",
};

// 채널별 다음 상태
export const CHANNEL_NEXT_STATUS = {
  GREEN: "CLEARED", // 수출은 바로 수리
  DOC: "SUPPLEMENT_REQUESTED",
  ANALYSIS: "UNDER_REVIEW", // 가격심사 대신 일반 심사
  RED: "INSPECTION",
};

// ========================================
// 위험도 (Risk Level)
// ========================================

export const RISK_LEVELS = {
  RED: "RED",
  GREEN: "GREEN",
};

export const RISK_LABELS = {
  RED: "Red",
  GREEN: "Green",
};

export const RISK_COLORS = {
  RED: "danger",
  GREEN: "success",
};

// ========================================
// 우선순위 (Priority)
// ========================================

export const PRIORITY_LEVELS = {
  URGENT: "URGENT", // 긴급
  HIGH: "HIGH", // 높음
  NORMAL: "NORMAL", // 보통
  LOW: "LOW", // 낮음
};

export const PRIORITY_LABELS = {
  URGENT: "긴급",
  HIGH: "높음",
  NORMAL: "보통",
  LOW: "낮음",
};

export const PRIORITY_COLORS = {
  URGENT: "danger",
  HIGH: "warning",
  NORMAL: "primary",
  LOW: "default",
};

// ========================================
// 검사 유형 (Inspection Type)
// ========================================

export const INSPECTION_TYPES = {
  FULL: "FULL", // 전량 검사
  SAMPLE: "SAMPLE", // 견본 검사
  DOCUMENT: "DOCUMENT", // 서류 검사
  SEAL: "SEAL", // 봉인 확인
};

export const INSPECTION_TYPE_LABELS = {
  FULL: "전량 검사",
  SAMPLE: "견본 검사",
  DOCUMENT: "서류 검사",
  SEAL: "봉인 확인",
};

// ========================================
// 검사 결과 (Inspection Result)
// ========================================

export const INSPECTION_RESULTS = {
  PASS: "PASS", // 적합
  FAIL: "FAIL", // 부적합
  CONDITIONAL: "CONDITIONAL", // 조건부 적합
};

export const INSPECTION_RESULT_LABELS = {
  PASS: "적합",
  FAIL: "부적합",
  CONDITIONAL: "조건부 적합",
};

export const INSPECTION_RESULT_COLORS = {
  PASS: "success",
  FAIL: "danger",
  CONDITIONAL: "warning",
};

// ========================================
// 수출자 유형
// ========================================

export const EXPORTER_TYPES = {
  AEO: "AEO공인업체",
  GENERAL: "일반업체",
  NEW: "신규업체",
};

// ========================================
// 거래 방식 (Trade Type)
// ========================================

export const TRADE_TYPES = {
  GENERAL: "일반수출",
  CONSIGNMENT: "위탁수출",
  TEMPORARY: "일시수출",
  RE_EXPORT: "재수출",
};

// ========================================
// 신고 유형 (Declaration Type)
// ========================================

export const DECLARATION_TYPES = {
  GENERAL: "일반신고",
  SIMPLIFIED: "간이신고",
  SPLIT: "분할신고",
};

// ========================================
// 통화 (Currency)
// ========================================

export const CURRENCIES = {
  KRW: "KRW",
  USD: "USD",
  TWD: "TWD",
  CNY: "CNY",
  JPY: "JPY",
  EUR: "EUR",
};

export const CURRENCY_LABELS = {
  KRW: "원 (₩)",
  USD: "달러 ($)",
  TWD: "대만달러 (NT$)",
  CNY: "위안 (¥)",
  JPY: "엔 (¥)",
  EUR: "유로 (€)",
};

// ========================================
// 운송 수단 (Transport Mode)
// ========================================

export const TRANSPORT_MODES = {
  AIR: "AIR",
  SEA: "SEA",
  LAND: "LAND",
};

export const TRANSPORT_MODE_LABELS = {
  AIR: "항공",
  SEA: "해상",
  LAND: "육상",
};

// ========================================
// 인코텀즈 (Incoterms)
// ========================================

export const INCOTERMS = {
  FOB: "FOB",
  CIF: "CIF",
  CFR: "CFR",
  EXW: "EXW",
  DDP: "DDP",
};

export const INCOTERMS_LABELS = {
  FOB: "FOB (본선인도)",
  CIF: "CIF (운임보험료포함)",
  CFR: "CFR (운임포함)",
  EXW: "EXW (공장인도)",
  DDP: "DDP (관세지급인도)",
};

// ========================================
// 첨부파일 유형 (Attachment Type)
// ========================================

export const ATTACHMENT_TYPES = {
  INVOICE: "INVOICE", // 송장
  PACKING_LIST: "PACKING_LIST", // 포장명세서
  BL: "BL", // 선하증권
  CERTIFICATE: "CERTIFICATE", // 원산지증명서
  CONTRACT: "CONTRACT", // 계약서
  OTHER: "OTHER", // 기타
};

export const ATTACHMENT_TYPE_LABELS = {
  INVOICE: "송장",
  PACKING_LIST: "포장명세서",
  BL: "선하증권",
  CERTIFICATE: "원산지증명서",
  CONTRACT: "계약서",
  OTHER: "기타",
};
