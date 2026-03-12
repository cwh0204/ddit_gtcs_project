// src/constants/inspectionReasons.js
// 📌 현품검사 관련 상수 정의

/**
 * 검사 결과 코드
 */
export const INSPECTION_RESULTS = [
  { code: "PASS", label: "합격" },
  { code: "FAIL", label: "불합격" },
];

export const INSPECTION_TYPES = [
  {
    code: "XRAY",
    label: "X-RAY 검사",
    description: "X-RAY 장비를 이용한 비파괴 검사",
  },
  {
    code: "OPEN",
    label: "개장검사",
    description: "포장을 개봉하여 실물 확인",
  },
  {
    code: "SAMPLE",
    label: "샘플 채취",
    description: "실험실 분석을 위한 샘플 채취",
  },
];

export const INSPECTION_FAIL_REASONS = [
  {
    code: "QUANTITY_MISMATCH",
    label: "수량 불일치",
    description: "신고 수량과 실제 수량이 다름",
  },
  {
    code: "SPEC_MISMATCH",
    label: "규격 불일치",
    description: "신고 규격(크기, 중량 등)과 실제가 다름",
  },
  {
    code: "QUALITY_ISSUE",
    label: "품질 불량",
    description: "품질 기준 미달 또는 불량품 발견",
  },
  {
    code: "PROHIBITED_ITEM",
    label: "금지 품목 발견",
    description: "수입 금지 품목이 포함됨",
  },
  {
    code: "DAMAGE",
    label: "파손/손상",
    description: "운송 중 파손 또는 손상 발견",
  },
  {
    code: "LABELING_ISSUE",
    label: "표시사항 위반",
    description: "원산지, 성분 등 표시사항이 부적합",
  },
  {
    code: "FAKE_GOODS",
    label: "위조품 의심",
    description: "상표권 침해 또는 위조품으로 의심됨",
  },
  {
    code: "OTHER",
    label: "기타",
    description: "기타 사유",
  },
];

export const getInspectionResultLabel = (code) => {
  const result = INSPECTION_RESULTS.find((r) => r.code === code);
  return result ? result.label : code;
};

export const getInspectionTypeLabel = (code) => {
  const type = INSPECTION_TYPES.find((t) => t.code === code);
  return type ? type.label : code;
};

export const getInspectionFailReasonLabel = (code) => {
  const reason = INSPECTION_FAIL_REASONS.find((r) => r.code === code);
  return reason ? reason.label : code;
};
