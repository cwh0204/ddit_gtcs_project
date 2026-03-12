/**
 * src/controller/custom/dashboard/useDashboardController.js
 * 📌 Dashboard Controller
 */

import { useImportListController } from "../import/useImportListController";
import { IMPORT_STATUSES } from "../../../domain/customs/import/importConstants";

export const useDashboardController = () => {
  // 기존 Import Controller 재사용
  const { declarations, statusCounts, urgentCount, isLoading, error, refetch } = useImportListController();

  if (import.meta.env.DEV) {
    console.log("[useDashboardController] 원본 데이터:", {
      declarations개수: declarations.length,
      statusCounts,
      urgentCount,
    });
  }

  // ========== 1. Dashboard 통계 계산 ==========
  const stats = {
    // 심사 대기 (PENDING_REVIEW)
    pending: statusCounts[IMPORT_STATUSES.PENDING_REVIEW] || 0,

    // 심사 중 (UNDER_REVIEW + AGENCY_REVIEW + SUPPLEMENT_REVIEW + CORRECTION_REVIEW)
    inReview:
      (statusCounts[IMPORT_STATUSES.UNDER_REVIEW] || 0) +
      (statusCounts[IMPORT_STATUSES.AGENCY_REVIEW] || 0) +
      (statusCounts[IMPORT_STATUSES.SUPPLEMENT_REVIEW] || 0) +
      (statusCounts[IMPORT_STATUSES.CORRECTION_REVIEW] || 0),

    // 검사 중 (INSPECTION)
    inspection: statusCounts[IMPORT_STATUSES.INSPECTION] || 0,

    // 완료 (APPROVED + CLEARED + RELEASE_APPROVED)
    completed:
      (statusCounts[IMPORT_STATUSES.APPROVED] || 0) +
      (statusCounts[IMPORT_STATUSES.CLEARED] || 0) +
      (statusCounts[IMPORT_STATUSES.RELEASE_APPROVED] || 0),

    // 긴급 (useImportListController에서 계산된 값)
    urgent: urgentCount,

    // SLA 위반 (신고일로부터 7일 초과)
    slaViolation: calculateSlaViolations(declarations),
  };

  // ========== 2. 긴급 처리 목록 (최대 3건) ==========
  const urgentItems = declarations
    .filter((d) => {
      // isUrgent는 boolean 또는 "긴급"/"일반" 문자열일 수 있음
      return d.isUrgent === true || d.isUrgent === "긴급";
    })
    .map((d) => {
      //마감일 계산 (납부 상태인 경우 납부 기한 사용)
      let deadline = "-";
      let remainingHours = 999;

      // 신고일로부터 7일 후를 임시 마감일로 사용
      if (d.declarationDate) {
        try {
          const declarationDate = new Date(d.declarationDate);
          const dueDate = new Date(declarationDate);
          dueDate.setDate(dueDate.getDate() + 7); // 7일 후

          deadline = dueDate.toLocaleString("ko-KR");
          remainingHours = calculateRemainingHours(dueDate.toISOString());
        } catch (e) {
          console.warn("[긴급 목록] 날짜 파싱 실패:", d.declarationDate);
        }
      }

      return {
        id: d.declarationId,
        declarationNo: d.declarationNumber,
        company: d.importerName || "-",
        status: d.statusLabel || "-",
        statusCode: d.statusCode,
        deadline,
        remainingHours,
      };
    })
    .sort((a, b) => a.remainingHours - b.remainingHours) // 남은 시간 적은 순
    .slice(0, 3);

  // ========== 3. 최근 신고 목록 (최대 5건) ==========
  const recentItems = declarations
    .filter((d) => d.declarationDate) // 날짜 있는 것만
    .sort((a, b) => {
      // 최신순 정렬
      try {
        const dateA = new Date(a.declarationDate);
        const dateB = new Date(b.declarationDate);
        return dateB - dateA;
      } catch (e) {
        return 0;
      }
    })
    .slice(0, 5)
    .map((d) => ({
      id: d.declarationId,
      declarationNo: d.declarationNumber,
      company: d.importerName || "-",
      itemName: extractItemName(d),
      status: d.statusLabel || "-",
      statusCode: d.statusCode,
      submittedAt: d.declarationDate,
    }));

  if (import.meta.env.DEV) {
    console.log("[useDashboardController] 변환 결과:", {
      stats,
      urgentItems개수: urgentItems.length,
      recentItems개수: recentItems.length,
    });
  }

  // Return
  return {
    stats,
    urgentItems,
    recentItems,
    isLoading,
    error,
    refetch,
  };
};

// ========== Helper Functions ==========

/**
 * 품목명 추출
 *
 * toListItem()은 품목 정보를 포함하지 않으므로
 * 실제로는 별도 API 호출이 필요할 수 있음
 *
 * @param {Object} declaration - 신고서 객체
 * @returns {String} 품목명
 */
function extractItemName(declaration) {
  return declaration.itemName || "-";
}

/**
 * SLA 위반 계산 (신고일로부터 7일 초과)
 *
 * @param {Array} declarations - 신고서 배열
 * @returns {Number} 위반 건수
 */
function calculateSlaViolations(declarations) {
  const now = new Date();
  const slaThresholdDays = 7;

  return declarations.filter((d) => {
    // 완료 상태는 제외
    if (d.statusCode === IMPORT_STATUSES.APPROVED || d.statusCode === IMPORT_STATUSES.CLEARED || d.statusCode === IMPORT_STATUSES.RELEASE_APPROVED) {
      return false;
    }

    // 신고일로부터 7일 초과 확인
    if (!d.declarationDate) {
      return false;
    }

    try {
      const declarationDate = new Date(d.declarationDate);
      const diffMs = now - declarationDate;
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      return diffDays > slaThresholdDays;
    } catch (e) {
      console.warn("[SLA 계산] 날짜 파싱 실패:", d.declarationDate);
      return false;
    }
  }).length;
}

/**
 * 남은 시간 계산 (시간 단위)
 *
 * @param {String} deadlineStr - ISO 날짜 문자열
 * @returns {Number} 남은 시간 (시간 단위)
 */
function calculateRemainingHours(deadlineStr) {
  if (!deadlineStr) return 999; // deadline 없으면 맨 뒤로

  try {
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diffMs = deadline - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    return Math.max(0, diffHours); // 음수면 0
  } catch (e) {
    console.warn("[남은시간 계산] 날짜 파싱 실패:", deadlineStr);
    return 999;
  }
}

export default useDashboardController;
