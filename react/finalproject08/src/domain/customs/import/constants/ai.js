//src/domain/customs/import/constants/ai.js

// 위험도 (Risk Level)
export const RISK_LEVELS = {
  RED: "RED",
  GREEN: "GREEN",
};

// importMapper.js와 호환되도록 RISK_LEVEL_LABELS로 export
export const RISK_LEVEL_LABELS = {
  GREEN: "GREEN",
  RED: "RED",
};

//기존 코드 호환성을 위해 RISK_LABELS도 유지
export const RISK_LABELS = RISK_LEVEL_LABELS;

export const RISK_COLORS = {
  GREEN: "success",
  RED: "danger",
};

// ========================================
// AI 점수 시스템
// ========================================

/**
 * AI 점수 종류 구분
 * - riskScore: 위험도 점수 (높을수록 RED, 위험)
 * - docScore: 서류심사 점수 (높을수록 GREEN, 안전) - 자동 처리 로직의 기준
 */
export const AI_SCORE_TYPES = {
  RISK: {
    key: "riskScore",
    label: "위험도 점수",
    description: "높을수록 위험 (RED)",
    getColor: (score) => {
      if (score >= 80) return "danger";
      if (score >= 60) return "warning";
      if (score >= 40) return "info";
      return "success";
    },
    getLabel: (score) => {
      if (score >= 80) return "고위험";
      if (score >= 60) return "중위험";
      if (score >= 40) return "저위험";
      return "안전";
    },
  },
  DOCUMENT: {
    key: "docScore",
    label: "서류심사 점수",
    description: "높을수록 안전 (GREEN)",
    getColor: (score) => {
      if (score >= 95) return "success";
      if (score >= 85) return "primary";
      if (score >= 50) return "warning"; // ⭐ 50부터
      return "danger";
    },
    getLabel: (score) => {
      if (score >= 95) return "우수";
      if (score >= 85) return "양호";
      if (score >= 50) return "미흡"; // ⭐ 50부터
      return "부적합";
    },
  },
};

/**
 * 서류심사 점수(docScore) 구간별 정보
 * ⭐ 자동 처리 로직의 기준
 *
 * 95-100: 자동 승인
 * 85-94: 세관원 직접 심사
 * 50-84: 자동 보완 요구
 * 0-49: 자동 반려
 */
export const DOC_SCORE_RANGES = {
  AUTO_APPROVED: {
    min: 95,
    max: 100,
    label: "자동 승인",
    status: "APPROVED",
    color: "success",
    description: "서류가 완벽합니다. 자동으로 승인 처리됩니다.",
    shortDesc: "서류 완벽",
    needsOfficerAction: false,
    autoProcessing: true,
  },
  OFFICER_REVIEW: {
    min: 85,
    max: 94,
    label: "세관원 심사 필요",
    status: "UNDER_REVIEW",
    color: "primary",
    description: "서류가 양호하지만 세관원의 최종 판단이 필요합니다.",
    shortDesc: "세관원 심사",
    needsOfficerAction: true, // ⭐ 세관원 필수 개입
    autoProcessing: false,
  },
  AUTO_SUPPLEMENT: {
    min: 50, // ⭐ 50부터 시작
    max: 84,
    label: "자동 보완 요구",
    status: "SUPPLEMENT_REQUESTED",
    color: "warning",
    description: "서류가 미흡합니다. 보완 서류를 제출해주세요.",
    shortDesc: "보완 필요",
    needsOfficerAction: false,
    autoProcessing: true,
  },
  AUTO_REJECTED: {
    min: 0,
    max: 49, // ⭐ 49까지만
    label: "자동 반려",
    status: "REJECTED",
    color: "danger",
    description: "서류가 부적합합니다. 신고서가 반려됩니다.",
    shortDesc: "반려",
    needsOfficerAction: false,
    autoProcessing: true,
  },
};

/**
 * 세관원 가능 액션 (85-94점 구간만 해당)
 */
export const OFFICER_AVAILABLE_ACTIONS = {
  SUPPLEMENT: {
    value: "SUPPLEMENT_REQUESTED",
    label: "보완 요구",
    description: "추가 서류 제출 요청",
    color: "warning",
  },
  INSPECTION: {
    value: "INSPECTION",
    label: "현품 검사",
    description: "실물 확인 필요",
    color: "primary",
  },
  REJECT: {
    value: "REJECTED",
    label: "반려",
    description: "신고서 거부",
    color: "danger",
  },
  APPROVE: {
    value: "APPROVED",
    label: "승인",
    description: "최종 승인",
    color: "success",
  },
};

// ========================================
// AI 점수 관련 유틸 함수들
// ========================================

/**
 * docScore에 따른 색상 반환
 * @param {number} docScore - 서류심사 점수 (0-100)
 * @returns {string} Badge variant (success/primary/warning/danger)
 */
export const getDocScoreColor = (docScore) => {
  if (docScore >= 95) return "success";
  if (docScore >= 85) return "primary";
  if (docScore >= 50) return "warning"; // ⭐ 50부터
  return "danger";
};

/**
 * riskScore에 따른 색상 반환
 * @param {number} riskScore - 위험도 점수 (0-100)
 * @returns {string} Badge variant (success/info/warning/danger)
 */
export const getRiskScoreColor = (riskScore) => {
  if (riskScore >= 80) return "danger";
  if (riskScore >= 60) return "warning";
  if (riskScore >= 40) return "info";
  return "success";
};

/**
 * docScore에 따른 라벨 반환
 * @param {number} docScore - 서류심사 점수
 * @returns {string} 라벨 (우수/양호/미흡/부적합)
 */
export const getDocScoreLabel = (docScore) => {
  if (docScore >= 95) return "우수";
  if (docScore >= 85) return "양호";
  if (docScore >= 50) return "미흡"; // ⭐ 50부터
  return "부적합";
};

/**
 * riskScore에 따른 라벨 반환
 * @param {number} riskScore - 위험도 점수
 * @returns {string} 라벨 (안전/저위험/중위험/고위험)
 */
export const getRiskScoreLabel = (riskScore) => {
  if (riskScore >= 80) return "고위험";
  if (riskScore >= 60) return "중위험";
  if (riskScore >= 40) return "저위험";
  return "안전";
};

/**
 * docScore 구간 정보 조회
 * @param {number} docScore - 서류심사 점수
 * @returns {object} DOC_SCORE_RANGES의 해당 구간 정보
 */
export const getDocScoreRangeInfo = (docScore) => {
  if (docScore >= 95) return DOC_SCORE_RANGES.AUTO_APPROVED;
  if (docScore >= 85) return DOC_SCORE_RANGES.OFFICER_REVIEW;
  if (docScore >= 50) return DOC_SCORE_RANGES.AUTO_SUPPLEMENT; // ⭐ 50부터
  return DOC_SCORE_RANGES.AUTO_REJECTED;
};

/**
 * docScore에 따른 상세 설명 반환
 * @param {number} docScore - 서류심사 점수
 * @returns {string} 설명 텍스트
 */
export const getDocScoreDescription = (docScore) => {
  const rangeInfo = getDocScoreRangeInfo(docScore);
  return `${rangeInfo.min}-${rangeInfo.max}점: ${rangeInfo.description}`;
};

/**
 * 세관원 액션 가능 여부 확인 (85-94점만 true)
 * @param {number} docScore - 서류심사 점수
 * @returns {boolean} 세관원 액션 가능 여부
 */
export const needsOfficerAction = (docScore) => {
  return docScore >= 85 && docScore <= 94;
};

/**
 * docScore 기반 예상 자동 처리 상태 반환
 * @param {number} docScore - 서류심사 점수
 * @returns {string} 예상 상태 (APPROVED/UNDER_REVIEW/SUPPLEMENT_REQUESTED/REJECTED)
 */
export const getExpectedAutoStatus = (docScore) => {
  const rangeInfo = getDocScoreRangeInfo(docScore);
  return rangeInfo.status;
};

/**
 * 점수 표시용 포맷팅
 * @param {number} score - 점수 (0-100)
 * @returns {string} 포맷팅된 문자열 (예: "95점")
 */
export const formatScore = (score) => {
  return `${score || 0}점`;
};

/**
 * 점수와 라벨을 함께 표시
 * @param {number} score - 점수
 * @param {string} type - 'doc' 또는 'risk'
 * @returns {string} 포맷팅된 문자열 (예: "95점 (우수)")
 */
export const formatScoreWithLabel = (score, type = "doc") => {
  const label = type === "doc" ? getDocScoreLabel(score) : getRiskScoreLabel(score);
  return `${formatScore(score)} (${label})`;
};
