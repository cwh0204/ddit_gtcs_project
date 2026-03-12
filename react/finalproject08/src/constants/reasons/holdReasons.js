// src/constants/holdReasons.js
// 📌 보류 사유코드 상수 정의

/**
 * 보류 사유코드 목록
 * - Frontend에서 상수로 관리
 * - Backend는 VARCHAR로 저장
 */
export const HOLD_REASONS = [
  {
    code: "INVESTIGATION",
    label: "정밀 조사 필요",
    description: "추가 조사가 필요한 경우",
  },
  {
    code: "ADDITIONAL_DOC",
    label: "추가 서류 확인 중",
    description: "제출된 서류의 진위 여부 확인 중",
  },
  {
    code: "PRICE_VERIFY",
    label: "가격 검증 중",
    description: "과세가격의 적정성 검증 중",
  },
  {
    code: "SUPERVISOR_REVIEW",
    label: "상급자 검토 필요",
    description: "상급자의 판단이 필요한 사안",
  },
  {
    code: "LAB_TEST",
    label: "실험실 분석 대기",
    description: "품질 검사 또는 성분 분석 중",
  },
  {
    code: "ORIGIN_VERIFY",
    label: "원산지 확인 중",
    description: "원산지 증명서 진위 확인 중",
  },
  {
    code: "POLICY_CHANGE",
    label: "정책 변경 확인",
    description: "최근 정책 변경 사항 확인 중",
  },
  {
    code: "OTHER",
    label: "기타",
    description: "기타 사유",
  },
];

/**
 * 사유코드로 라벨 조회
 */
export const getHoldReasonLabel = (code) => {
  const reason = HOLD_REASONS.find((r) => r.code === code);
  return reason ? reason.label : code;
};

/**
 * 사유코드로 설명 조회
 */
export const getHoldReasonDescription = (code) => {
  const reason = HOLD_REASONS.find((r) => r.code === code);
  return reason ? reason.description : "";
};
