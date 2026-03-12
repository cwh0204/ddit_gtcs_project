/**
 * src/constants/rejectionReasons.js
 */

export const REJECTION_REASONS = [
  {
    code: "DOC_MISSING",
    label: "서류 미비",
    description: "필수 첨부 서류가 누락되었거나 불충분한 경우",
  },
  {
    code: "REQ_NOT_MET",
    label: "요건 불충족",
    description: "수입 요건을 충족하지 못한 경우",
  },
  {
    code: "LAW_VIOLATION",
    label: "법령 위반",
    description: "관세법 또는 관련 법령을 위반한 경우",
  },
  {
    code: "PRICE_ISSUE",
    label: "가격 산정 오류",
    description: "과세가격 산정에 오류가 있는 경우",
  },
  {
    code: "HS_CODE_ERROR",
    label: "HS코드 분류 오류",
    description: "품목 분류(HS코드)가 잘못된 경우",
  },
  {
    code: "ORIGIN_ISSUE",
    label: "원산지 문제",
    description: "원산지 증명이 불충분하거나 의심스러운 경우",
  },
  {
    code: "PROHIBITED_ITEM",
    label: "금지 품목",
    description: "수입이 금지된 품목인 경우",
  },
  {
    code: "OTHER",
    label: "기타",
    description: "기타 사유",
  },
];
export const getRejectionReasonLabel = (code) => {
  const reason = REJECTION_REASONS.find((r) => r.code === code);
  return reason ? reason.label : code;
};

/**
 * 사유코드로 설명 조회
 */
export const getRejectionReasonDescription = (code) => {
  const reason = REJECTION_REASONS.find((r) => r.code === code);
  return reason ? reason.description : "";
};
