// src/domain/customs/export/constants/backend.js

/**
 * 백엔드 상태값 매핑
 * ⭐ 실제 백엔드 상태코드(RELEASE_APPROVED 등) 추가
 */

import { EXPORT_STATUSES } from "./status";

export const BACKEND_STATUS_MAP = {
  // 백엔드 상태 → 프론트엔드 상태
  REVIEWING: "REVIEWING",
  REVIEW_COMPLETED: "PHYSICAL",
  FINAL_APPROVED: "APPROVED",
  CLEARED: "ACCEPTED",
  REJECTED: "REJECTED",

  // 구버전 코드 → 현재 코드
  WH_OUT_APPROVED: "RELEASE_APPROVED",
  WH_OUT_REJECTED: "RELEASE_REJECTED",

  // 한글 상태 → 영문 상태
  "심사 대기": "WAITING",
  "심사 중": "REVIEWING",
  심사중: "REVIEWING",
  "검사 중": "PHYSICAL",
  검사중: "PHYSICAL",
  "검사 완료": "PHYSICAL",
  검사완료: "PHYSICAL",
  "보완 요구": "SUPPLEMENT",
  보완요구: "SUPPLEMENT",
  "정정 요구": "SUPPLEMENT",
  정정요구: "SUPPLEMENT",
  "수리 완료": "ACCEPTED",
  수리완료: "ACCEPTED",
  "최종 승인": "APPROVED",
  최종승인: "APPROVED",
  통관승인: "APPROVED",
  승인: "APPROVED",
  반려: "REJECTED",
  반출승인: "RELEASE_APPROVED",
  반출차단: "RELEASE_REJECTED",
  반입승인: "WH_IN_APPROVED",
  반입차단: "WH_IN_REJECTED",
};

/**
 * 백엔드 상태값 정규화 함수
 * @param {string} status - 백엔드에서 받은 상태값
 * @returns {string} 정규화된 프론트엔드 상태값
 */
export const normalizeBackendStatus = (status) => {
  if (!status) return null;

  // 1. 이미 프론트엔드 형식이면 그대로 반환
  //    EXPORT_STATUSES 객체의 키로 존재하는지 확인
  if (Object.keys(EXPORT_STATUSES).includes(status)) {
    return status;
  }

  // 2. 백엔드 매핑에 있으면 변환
  if (BACKEND_STATUS_MAP[status]) {
    return BACKEND_STATUS_MAP[status];
  }

  // 3. 알 수 없는 상태면 그대로 반환 (로그 출력)
  console.warn("[normalizeBackendStatus] 알 수 없는 상태:", status);
  return status;
};
