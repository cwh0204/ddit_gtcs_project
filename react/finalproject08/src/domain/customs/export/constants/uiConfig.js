// src/domain/customs/export/constants/uiConfig.js

/**
 * Export UI 설정
 * ⭐ 수입과 동일한 탭 구조로 변경
 */

import { EXPORT_STATUSES, STATUS_LABELS } from "./status";

// ========================================
// 탭 구성
// ⭐ 수정: 전체, 심사대기, 심사중, 수리, 검사중, 보완/정정, 통관승인, 반려
// (환급대기, 환급완료 제거)
// ========================================

export const EXPORT_REVIEW_TABS = [
  {
    id: "all",
    label: "전체",
    filter: {},
  },
  {
    id: "waiting",
    label: "심사대기",
    filter: { status: "WAITING" },
  },
  {
    id: "reviewing",
    label: "심사중",
    filter: { status: "REVIEWING" },
  },
  {
    id: "accepted",
    label: "수리",
    filter: { status: "ACCEPTED" },
  },
  {
    id: "physical",
    label: "검사중",
    filter: { status: "PHYSICAL" },
  },
  {
    id: "supplement",
    label: "보완/정정",
    filter: { status: "SUPPLEMENT" },
  },
  {
    id: "approved",
    label: "통관승인",
    filter: { status: "APPROVED" },
  },
  {
    id: "rejected",
    label: "반려",
    filter: { status: "REJECTED" },
  },
];

// ========================================
// 필터 가능한 상태 목록
// ========================================

export const FILTERABLE_STATUSES = [
  { value: "WAITING", label: STATUS_LABELS.WAITING },
  { value: "REVIEWING", label: STATUS_LABELS.REVIEWING },
  { value: "PHYSICAL", label: STATUS_LABELS.PHYSICAL },
  { value: "SUPPLEMENT", label: STATUS_LABELS.SUPPLEMENT },
  { value: "ACCEPTED", label: STATUS_LABELS.ACCEPTED },
  { value: "REJECTED", label: STATUS_LABELS.REJECTED },
  { value: "RELEASE_APPROVED", label: STATUS_LABELS.RELEASE_APPROVED },
  { value: "RELEASE_REJECTED", label: STATUS_LABELS.RELEASE_REJECTED },
  { value: "APPROVED", label: STATUS_LABELS.APPROVED },
  { value: "DELIVERED", label: STATUS_LABELS.DELIVERED },
];

// ========================================
// 긴급 여부 옵션
// ========================================

export const URGENT_OPTIONS = [
  { value: "", label: "전체" },
  { value: "true", label: "긴급" },
  { value: "false", label: "일반" },
];

// ========================================
// 통계 카드 설정
// ========================================

export const STAT_CARD_CONFIGS = [
  {
    key: "pending",
    title: "심사 대기",
    description: "접수된 신규 신고서",
    className: "bg-slate-50 text-slate-700 border-slate-200",
    statusKey: EXPORT_STATUSES.WAITING,
  },
  {
    key: "inReview",
    title: "심사 중",
    description: "현재 검토 중인 신고서",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
    statusKey: EXPORT_STATUSES.REVIEWING,
  },
  {
    key: "inspection",
    title: "검사 중",
    description: "현품 검사 진행 중",
    className: "bg-violet-50 text-violet-700 border-violet-200",
    statusKey: EXPORT_STATUSES.PHYSICAL,
  },
  {
    key: "urgent",
    title: "긴급 처리",
    description: "긴급 처리 필요",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    isUrgentCount: true,
  },
];

// ========================================
// AG Grid 컬럼 설정
// ========================================

export const EXPORT_GRID_COLUMNS = [
  {
    headerName: "신고번호",
    field: "declarationNumber",
    width: 180,
    pinned: "left",
  },
  {
    headerName: "상태",
    field: "statusLabel",
    width: 130,
  },
  {
    headerName: "긴급",
    field: "isUrgent",
    width: 80,
  },
  {
    headerName: "수출자",
    field: "exporterName",
    width: 200,
  },
  {
    headerName: "신고일시",
    field: "declarationDate",
    width: 160,
  },
  {
    headerName: "담당자",
    field: "assignedOfficer",
    width: 120,
  },
  {
    headerName: "위험도",
    field: "riskLevelLabel",
    width: 100,
  },
];
