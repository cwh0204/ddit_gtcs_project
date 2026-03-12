//src/domain/customs/import/constants/uiConfig.js

import { IMPORT_STATUSES, STATUS_LABELS } from "./status";

// ========================================
// 통계 카드 설정
// ========================================

export const STAT_CARD_CONFIGS = [
  {
    key: "waiting",
    title: "심사 대기",
    description: "접수된 신규 신고서",
    className: "bg-slate-50 text-slate-700 border-slate-200",
    statusKey: "WAITING",
  },
  {
    key: "reviewing",
    title: "심사 중",
    description: "현재 검토 중인 신고서",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
    statusKey: "REVIEWING",
  },
  {
    key: "physical",
    title: "검사 중",
    description: "현품 검사 진행 중",
    className: "bg-violet-50 text-violet-700 border-violet-200",
    statusKey: "PHYSICAL",
  },
  {
    key: "supplement",
    title: "보완/정정",
    description: "보완 또는 정정 필요",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    statusKey: "SUPPLEMENT",
  },
];

// ========================================
// 필터 가능한 상태 목록
// ========================================

export const FILTERABLE_STATUSES = [
  { value: "WAITING", label: STATUS_LABELS.WAITING },
  { value: "REVIEWING", label: STATUS_LABELS.REVIEWING },
  { value: "ESCALATED", label: STATUS_LABELS.ESCALATED },
  { value: "PHYSICAL", label: STATUS_LABELS.PHYSICAL },
  { value: "SUPPLEMENT", label: STATUS_LABELS.SUPPLEMENT },
  { value: "ACCEPTED", label: STATUS_LABELS.ACCEPTED },
  { value: "REJECTED", label: STATUS_LABELS.REJECTED },
  { value: "PAY_WAITING", label: STATUS_LABELS.PAY_WAITING },
  { value: "PAY_COMPLETED", label: STATUS_LABELS.PAY_COMPLETED },
  { value: "RELEASE_APPROVED", label: STATUS_LABELS.RELEASE_APPROVED },
  { value: "RELEASE_REJECTED", label: STATUS_LABELS.RELEASE_REJECTED },
  { value: "APPROVED", label: STATUS_LABELS.APPROVED },
  { value: "DELIVERED", label: STATUS_LABELS.DELIVERED },
];

export const URGENT_OPTIONS = [
  { value: "", label: "전체" },
  { value: "true", label: "긴급" },
  { value: "false", label: "일반" },
];

// ========================================
// 세관원용 탭 구성
// ========================================

export const IMPORT_REVIEW_TABS = [
  {
    id: "all",
    label: "전체",
    filter: {},
    description: "전체 수입신고",
  },
  {
    id: "waiting",
    label: "심사대기",
    filter: { status: "WAITING" },
    description: "심사 대기 중인 신고",
  },
  {
    id: "reviewing",
    label: "심사중",
    filter: { status: "REVIEWING" },
    description: "심사 진행 중인 신고",
  },
  {
    id: "escalated",
    label: "결재요청",
    filter: { status: "ESCALATED" },
    description: "상급자 결재 요청 건",
  },
  {
    id: "accepted",
    label: "수리",
    filter: { status: "ACCEPTED" },
    description: "수리 완료된 신고",
  },
  {
    id: "physical",
    label: "검사중",
    filter: { status: "PHYSICAL" },
    description: "현품 검사 중인 신고",
  },
  {
    id: "supplement",
    label: "보완/정정",
    filter: { status: "SUPPLEMENT" },
    description: "보완 또는 정정 요청된 신고",
  },
  {
    id: "payment-pending",
    label: "납부대기",
    filter: { status: "PAY_WAITING" },
    description: "납부 대기 중인 건",
    isTaxTab: true,
  },
  {
    id: "payment-completed",
    label: "납부완료",
    filter: { status: "PAY_COMPLETED" },
    description: "납부가 완료된 건",
    isTaxTab: true,
  },
  {
    id: "approved",
    label: "통관승인",
    filter: { status: "APPROVED" },
    description: "통관 승인된 신고",
  },
  {
    id: "rejected",
    label: "반려",
    filter: { status: "REJECTED" },
    description: "반려된 신고",
  },
];

// ========================================
// 창고관리인용 탭 구성
// ========================================

export const WAREHOUSE_TABS = [
  {
    id: "all",
    label: "전체목록",
    filter: {},
    description: "전체 화물",
  },
  {
    id: "bonded-in",
    label: "보세입고",
    filter: { status: "BONDED_IN" },
    description: "보세창고 입고 완료",
  },
  {
    id: "physical",
    label: "검사중",
    filter: { status: "PHYSICAL" },
    description: "현품 검사 중",
  },
  {
    id: "wh-in",
    label: "반입관리",
    filter: { status: ["WH_IN_APPROVED", "WH_IN_REJECTED"] },
    description: "국내 창고 반입 승인/차단",
  },
  {
    id: "release",
    label: "반출관리",
    filter: { status: ["RELEASE_APPROVED", "RELEASE_REJECTED"] },
    description: "보세 창고 반출 승인/차단",
  },
  {
    id: "approved",
    label: "통관승인",
    filter: { status: "APPROVED" },
    description: "통관 승인 완료",
  },
  {
    id: "delivered",
    label: "출고완료",
    filter: { status: "DELIVERED" },
    description: "출고 완료",
  },
];
