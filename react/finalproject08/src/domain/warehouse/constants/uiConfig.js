// src/domain/warehouse/constants/uiConfig.js

import { ZONE_LIST } from "./status";

// 탭 구성

export const CARGO_TABS = [
  {
    id: "all",
    label: "전체 화물",
    filter: {},
    description: "전체 화물 현황",
  },
  {
    id: "bonded",
    label: "보세창고",
    filter: {
      positionArea: "BONDED",
    },
    description: "보세창고에 보관중인 화물",
  },
  {
    id: "local",
    label: "국내창고",
    filter: {
      positionArea: "LOCAL",
    },
    description: "국내창고에 보관중인 화물",
  },
  {
    id: "inspection",
    label: "검사",
    filter: {
      status: "PHYSICAL",
    },
    description: "현품 검사가 필요한 화물",
  },
];

// 수입 화물 탭
export const IMPORT_CARGO_TABS = [
  { id: "all", label: "수입 전체 화물" },
  { id: "bonded", label: "보세창고 목록" },
  { id: "inspection", label: "검사 목록" },
  { id: "local", label: "국내창고 목록" },
];

// 수출 화물 탭
export const EXPORT_CARGO_TABS = [
  { id: "all", label: "수출 전체 화물" },
  { id: "local", label: "국내창고 목록" },
  { id: "inspection", label: "검사 목록" },
  { id: "bonded", label: "보세창고 목록" },
];

// AG Grid 컬럼 설정
export const CARGO_GRID_COLUMNS = [
  {
    headerName: "컨테이너 ID",
    field: "containerId",
    width: 150,
    pinned: "left",
    checkboxSelection: true,
  },
  {
    headerName: "구역",
    field: "zone",
    width: 80,
  },
  {
    headerName: "위치",
    field: "position",
    width: 100,
  },
  {
    headerName: "상태",
    field: "statusLabel",
    width: 120,
  },
  {
    headerName: "품목",
    field: "itemName",
    width: 200,
  },
  {
    headerName: "무게",
    field: "weight",
    width: 100,
  },
  {
    headerName: "입고일",
    field: "inboundDateFormatted",
    width: 130,
  },
  {
    headerName: "예상 출고일",
    field: "expectedOutboundDateFormatted",
    width: 130,
  },
  {
    headerName: "화주",
    field: "owner",
    width: 150,
  },
  {
    headerName: "체류 시간",
    field: "dwellTimeText",
    width: 120,
  },
];

// 필터 옵션
/**
 * 창고 관리자가 필터링할 수 있는 신고서 상태들
 * Import/Export Master 테이블의 status 컬럼 값 기준
 */
export const FILTERABLE_STATUSES = [
  { value: "BONDED_IN", label: "보세입고" },
  { value: "WAITING", label: "심사대기" },
  { value: "PHYSICAL", label: "검사중" },
  { value: "SUPPLEMENT", label: "보완/정정" },
  { value: "REVIEWING", label: "심사중" },
  { value: "ACCEPTED", label: "수리" },
  { value: "REJECTED", label: "반려" },
  { value: "PAY_WAITING", label: "납부대기" },
  { value: "PAY_COMPLETED", label: "납부완료" },
  { value: "WH_IN_APPROVED", label: "반입승인" },
  { value: "WH_IN_REJECTED", label: "반입차단" },
  { value: "RELEASE_APPROVED", label: "반출승인" },
  { value: "RELEASE_REJECTED", label: "반출차단" },
  { value: "INSPECTION_COMPLETED", label: "검사완료" },
  { value: "APPROVED", label: "통관승인" },
  { value: "DELIVERED", label: "출고완료" },
];

//긴급 옵션
export const URGENT_OPTIONS = [
  { value: "true", label: "긴급" },
  { value: "false", label: "일반" },
];

export const ZONE_OPTIONS = ZONE_LIST.map((zone) => ({
  value: zone,
  label: `${zone}구역`,
}));

// 통계 카드 설정
export const STAT_CARD_CONFIGS = [
  {
    key: "bonded",
    title: "보세창고",
    description: "보세구역 보관 화물",
    className: "bg-slate-50 text-slate-700 border-slate-200",
  },
  {
    key: "local",
    title: "국내창고",
    description: "국내창고 보관 화물",
    className: "bg-slate-50 text-slate-700 border-slate-200",
  },
  {
    key: "inspection",
    title: "검사중",
    description: "현품 검사 진행중",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    key: "approved",
    title: "통관승인",
    description: "통관 승인 완료",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
];

// ========== InspectionActionForm 액션 설정 ==========
// 검사완료 / 반출차단 폼의 타입별 UI 및 텍스트 설정
export const INSPECTION_ACTION_CONFIG = {
  complete: {
    title: "검사 완료",
    bgColor: "bg-green-50",
    borderColor: "border-green-300",
    textColor: "text-green-900",
    focusRing: "focus:ring-green-500",
    borderTopColor: "border-green-200",
    buttonColor: "bg-green-500 hover:bg-green-600",
    label: "검사 의견",
    buttonText: "검사 완료 확정",
    placeholder: "검사 결과 및 의견을 입력하세요.",
    helpText: "검사 의견은 세관에 전달됩니다.",
    autoPrefix: "다음 항목을 검사하였습니다",
  },
  block: {
    title: "반출 차단",
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
    textColor: "text-red-900",
    focusRing: "focus:ring-red-500",
    borderTopColor: "border-red-200",
    buttonColor: "bg-red-500 hover:bg-red-600",
    label: "반출 차단 사유",
    buttonText: "반출 차단 확정",
    placeholder: "반출 차단 사유를 상세히 입력하세요.",
    helpText: "반출 차단 사유는 세관 및 화주에게 전달됩니다.",
    autoPrefix: "다음 항목에서 문제가 발견되었습니다",
  },
};
