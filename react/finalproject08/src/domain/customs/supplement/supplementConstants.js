// src/domain/customs/supplement/supplementConstants.js

/**
 * 보완/정정 관리 페이지 전용 상수
 */

// 탭 구성 (4개 - 업무 흐름 기반)
export const SUPPLEMENT_REVIEW_TABS = [
  {
    id: "all",
    label: "보완/정정 목록",
    filter: {
      status: [
        "SUPPLEMENT_REQUESTED",
        "SUPPLEMENT_SUBMITTED",
        "SUPPLEMENT_REVIEW",
        "CORRECTION_REQUESTED",
        "CORRECTION_SUBMITTED",
        "CORRECTION_REVIEW",
      ],
    },
    description: "전체 보완 및 정정",
  },
  {
    id: "request",
    label: "보완/정정 요구",
    filter: {
      status: ["SUPPLEMENT_REQUESTED", "CORRECTION_REQUESTED"],
    },
    description: "부족한 서류 요청 및 오류 항목 수정 요청",
  },
  {
    id: "submitted",
    label: "제출 현황 조회",
    filter: {
      status: ["SUPPLEMENT_SUBMITTED", "CORRECTION_SUBMITTED"],
    },
    description: "보완/정정 제출 현황",
  },
  {
    id: "review",
    label: "재심사 및 승인",
    filter: {
      status: ["SUPPLEMENT_REVIEW", "CORRECTION_REVIEW"],
    },
    description: "제출된 보완/정정 건 검토 및 승인",
  },
];

// 보완/정정 액션 버튼 정의
export const SUPPLEMENT_ACTIONS = {
  // 보완 요구 상태에서 가능한 액션
  SUPPLEMENT_REQUESTED: [
    { id: "remind", label: "보완 독촉", variant: "warning" },
    { id: "cancel", label: "요구 취소", variant: "outline" },
  ],

  // 보완 제출 상태에서 가능한 액션
  SUPPLEMENT_SUBMITTED: [
    { id: "start_review", label: "심사 시작", variant: "primary" },
    { id: "request_again", label: "재보완 요구", variant: "warning" },
  ],

  // 보완 심사 상태에서 가능한 액션
  SUPPLEMENT_REVIEW: [
    { id: "approve", label: "보완 승인", variant: "approval" },
    { id: "reject", label: "보완 반려", variant: "danger" },
    { id: "request_again", label: "재보완 요구", variant: "warning" },
  ],

  // 정정 요구 상태
  CORRECTION_REQUESTED: [
    { id: "remind", label: "정정 독촉", variant: "warning" },
    { id: "cancel", label: "요구 취소", variant: "outline" },
  ],

  // 정정 제출 상태
  CORRECTION_SUBMITTED: [
    { id: "start_review", label: "심사 시작", variant: "primary" },
    { id: "request_again", label: "재정정 요구", variant: "warning" },
  ],

  // 정정 심사 상태
  CORRECTION_REVIEW: [
    { id: "approve", label: "정정 승인", variant: "approval" },
    { id: "reject", label: "정정 반려", variant: "danger" },
    { id: "request_again", label: "재정정 요구", variant: "warning" },
  ],
};

// 보완/정정 타입
export const SUPPLEMENT_TYPES = {
  SUPPLEMENT: "SUPPLEMENT",
  CORRECTION: "CORRECTION",
};

export const SUPPLEMENT_TYPE_LABELS = {
  SUPPLEMENT: "보완",
  CORRECTION: "정정",
};
