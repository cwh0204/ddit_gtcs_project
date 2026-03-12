// src/domain/announcement/announcementConstants.js

/**
 * 공지사항 카테고리
 */
export const ANNOUNCEMENT_CATEGORIES = {
  SYSTEM: "SYSTEM", // 시스템공지
  IMPORT: "IMPORT", // 수입통관
  EXPORT: "EXPORT", // 수출통관
  LOGISTICS: "LOGISTICS", // 화물/물류
  NORMAL: "NORMAL", // 일반
};

export const CATEGORY_LABELS = {
  SYSTEM: "시스템",
  IMPORT: "수입통관",
  EXPORT: "수출통관",
  LOGISTICS: "화물/물류",
  NORMAL: "일반",
};

export const CATEGORY_BADGE_VARIANTS = {
  SYSTEM: "purple", // 보라색
  IMPORT: "primary", // 파란색
  EXPORT: "success", // 녹색
  LOGISTICS: "warning", // 주황색
  NORMAL: "default", // 회색
};

/**
 * 검색 타입
 */
export const SEARCH_TYPES = {
  TITLE: "title",
  DEPT: "dept",
};

export const SEARCH_TYPE_OPTIONS = [
  { value: SEARCH_TYPES.TITLE, label: "제목" },
  { value: SEARCH_TYPES.DEPT, label: "부서" },
];

/**
 * 카테고리 필터 옵션
 */
export const CATEGORY_FILTER_OPTIONS = [
  { value: "", label: "전체" },
  { value: ANNOUNCEMENT_CATEGORIES.SYSTEM, label: CATEGORY_LABELS.SYSTEM },
  { value: ANNOUNCEMENT_CATEGORIES.IMPORT, label: CATEGORY_LABELS.IMPORT },
  { value: ANNOUNCEMENT_CATEGORIES.EXPORT, label: CATEGORY_LABELS.EXPORT },
  { value: ANNOUNCEMENT_CATEGORIES.LOGISTICS, label: CATEGORY_LABELS.LOGISTICS },
  { value: ANNOUNCEMENT_CATEGORIES.NORMAL, label: CATEGORY_LABELS.NORMAL },
];

/**
 * 페이지 크기
 */
export const PAGE_SIZE = 10;

/**
 * New 배지 표시 기준 (며칠 이내)
 */
export const NEW_BADGE_DAYS = 7;
