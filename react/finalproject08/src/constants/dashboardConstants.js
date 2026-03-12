/**
 * src/constants/dashboardConstants.js
 * 📌 Dashboard 상수 정의
 * - 통계 카드 색상
 * - Dashboard 전용 설정
 */

export const STAT_CARD_COLORS = {
  pending: "bg-slate-50 text-slate-700 border-slate-200",
  inReview: "bg-indigo-50 text-indigo-700 border-indigo-200",

  // 검사 중 - 보라 계열
  inspection: "bg-violet-50 text-violet-700 border-violet-200",

  // 완료 - 녹색 계열
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",

  // 긴급 - 주황 계열 (경고)
  urgent: "bg-amber-50 text-amber-700 border-amber-200",

  // SLA 위반 - 빨강 계열 (위험)
  violation: "bg-rose-50 text-rose-700 border-rose-200",
};

export const STAT_CARD_GRADIENTS = {
  // 심사 중 - 그라데이션 강조
  inReview: "bg-gradient-to-br from-indigo-500 to-blue-600 text-white border-indigo-300 shadow-lg shadow-indigo-200",

  // 긴급 - 그라데이션 경고
  urgent: "bg-gradient-to-br from-amber-400 to-orange-500 text-white border-amber-300 shadow-lg shadow-amber-200",

  // SLA 위반 - 그라데이션 위험
  violation: "bg-gradient-to-br from-rose-500 to-red-600 text-white border-red-300 shadow-lg shadow-red-200",
};

export const DASHBOARD_CONFIG = {
  // 긴급 목록 표시 개수
  urgentItemsLimit: 3,

  // 최근 목록 표시 개수
  recentItemsLimit: 5,

  // SLA 기준 (일)
  slaThresholdDays: 7,

  // 남은 시간 경고 기준 (시간)
  urgentWarningHours: 24,
};
