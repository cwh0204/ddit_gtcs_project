// src/domain/customs/tax/taxConstants.js

/**
 * 세액 및 납부 관리 페이지 전용 상수
 */

// ========================================
// 납부 상태 (Application 레벨)
// ========================================
export const PAYMENT_STATUSES = {
  UNPAID: "UNPAID", // 미납 (고지서 미발송)
  NOTICE_ISSUED: "NOTICE_ISSUED", // 고지서 발송 (Application)
  PAYMENT_PENDING: "PAYMENT_PENDING", // 납부 대기 (Application)
  PAYMENT_OVERDUE: "PAYMENT_OVERDUE", // 납부 기한 초과 (Application)
  PAYMENT_COMPLETED: "PAYMENT_COMPLETED", // 납부 완료 (DB: PAID)
  REFUND_PENDING: "REFUND_PENDING", // 환급 대기 (향후 확장)
  REFUND_COMPLETED: "REFUND_COMPLETED", // 환급 완료 (향후 확장)
};

export const PAYMENT_STATUS_LABELS = {
  UNPAID: "미납",
  NOTICE_ISSUED: "고지서 발송",
  PAYMENT_PENDING: "납부 대기",
  PAYMENT_OVERDUE: "납부 기한 초과",
  PAYMENT_COMPLETED: "납부 완료",
  REFUND_PENDING: "환급 대기",
  REFUND_COMPLETED: "환급 완료",
};

export const PAYMENT_STATUS_BADGE_VARIANTS = {
  UNPAID: "default",
  NOTICE_ISSUED: "warning",
  PAYMENT_PENDING: "danger",
  PAYMENT_OVERDUE: "danger",
  PAYMENT_COMPLETED: "success",
  REFUND_PENDING: "primary",
  REFUND_COMPLETED: "success",
};

// DB 납부 상태 (실제 DB 값)
export const DB_PAYMENT_STATUSES = {
  UNPAID: "UNPAID", // 미납
  PAID: "PAID", // 완납
};

// 탭 구성 (수정 완료)
export const TAX_REVIEW_TABS = [
  {
    id: "all",
    label: "전체 목록",
    filter: {}, //빈 객체 = 전체
    description: "모든 세액 및 납부 건",
  },
  {
    id: "notice",
    label: "고지서 발송",
    filter: {
      status: "NOTICE_ISSUED",
    },
    description: "고지서가 발송된 건",
  },
  {
    id: "pending",
    label: "납부 대기",
    filter: {
      status: ["PAYMENT_PENDING", "PAYMENT_OVERDUE"], // 배열
    },
    description: "납부 대기 및 기한 초과 건",
  },
  {
    id: "completed",
    label: "납부 완료",
    filter: {
      status: "PAYMENT_COMPLETED",
    },
    description: "납부가 완료된 건",
  },
];

// 필터 가능한 상태 목록
export const FILTERABLE_TAX_STATUSES = [
  { value: "UNPAID", label: "미납" },
  { value: "NOTICE_ISSUED", label: "고지서 발송" },
  { value: "PAYMENT_PENDING", label: "납부 대기" },
  { value: "PAYMENT_OVERDUE", label: "납부 기한 초과" },
  { value: "PAYMENT_COMPLETED", label: "납부 완료" },
];

// 긴급 옵션
export const URGENT_OPTIONS = [
  { value: "", label: "전체" },
  { value: "true", label: "긴급" },
  { value: "false", label: "일반" },
];
