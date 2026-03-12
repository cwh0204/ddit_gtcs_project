// src/domain/warehouse/mapper/utils.js

/**
 * Warehouse Mapper 유틸리티 함수
 * 날짜 포맷, 시간 계산 등
 */

// ========================================
// 날짜 포맷
// ========================================

/**
 * 날짜 포맷 (YYYY-MM-DD HH:mm)
 */
export function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

// ========================================
// 체류 시간 계산
// ========================================

/**
 * 체류 시간 계산 (시간 단위)
 */
export function calculateDwellTime(inboundDate) {
  if (!inboundDate) return 0;
  const now = new Date();
  const inbound = new Date(inboundDate);
  return Math.floor((now - inbound) / (1000 * 60 * 60)); // 시간
}

/**
 * 체류 시간 텍스트
 */
export function getDwellTimeText(inboundDate) {
  const hours = calculateDwellTime(inboundDate);
  if (hours < 24) return `${hours}시간`;
  const days = Math.floor(hours / 24);
  return `${days}일 ${hours % 24}시간`;
}

// ========================================
// 기한 관련
// ========================================

/**
 * 기한 초과 여부
 */
export function isOverdue(expectedDate) {
  if (!expectedDate) return false;
  return new Date() > new Date(expectedDate);
}

/**
 * 남은 일수 계산
 */
export function calculateDaysUntil(targetDate) {
  if (!targetDate) return 0;
  const now = new Date();
  const target = new Date(targetDate);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

// ========================================
// 대기 시간 계산
// ========================================

/**
 * 대기 시간 계산 (분 단위)
 */
export function calculateWaitingTime(requestedAt) {
  if (!requestedAt) return 0;
  const now = new Date();
  const requested = new Date(requestedAt);
  return Math.floor((now - requested) / (1000 * 60)); // 분
}

/**
 * 대기 시간 텍스트
 */
export function getWaitingTimeText(requestedAt) {
  const minutes = calculateWaitingTime(requestedAt);
  if (minutes < 60) return `${minutes}분`;
  const hours = Math.floor(minutes / 60);
  return `${hours}시간 ${minutes % 60}분`;
}

// ========================================
// 진행 시간 계산
// ========================================

/**
 * 진행 시간 계산 (분 단위)
 */
export function calculateProgressTime(startedAt) {
  if (!startedAt) return 0;
  const now = new Date();
  const started = new Date(startedAt);
  return Math.floor((now - started) / (1000 * 60)); // 분
}

/**
 * 진행 시간 텍스트
 */
export function getProgressTimeText(startedAt, estimatedDuration) {
  const elapsed = calculateProgressTime(startedAt);
  return `${elapsed}분 / ${estimatedDuration}분`;
}

/**
 * 검사 지연 여부
 */
export function isInspectionDelayed(startedAt, estimatedDuration) {
  if (!startedAt || !estimatedDuration) return false;
  const elapsed = calculateProgressTime(startedAt);
  return elapsed > estimatedDuration;
}

// ========================================
// 경과 시간 계산
// ========================================

/**
 * 경과 시간 계산 (분 단위)
 */
export function calculateElapsedTime(createdAt) {
  if (!createdAt) return 0;
  const now = new Date();
  const created = new Date(createdAt);
  return Math.floor((now - created) / (1000 * 60)); // 분
}

/**
 * 경과 시간 텍스트
 */
export function getElapsedTimeText(createdAt) {
  const minutes = calculateElapsedTime(createdAt);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}
