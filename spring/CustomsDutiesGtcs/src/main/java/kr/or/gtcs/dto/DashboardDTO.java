package kr.or.gtcs.dto;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * 대시보드 전용 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    // ===== Tab 1: 긴급 처리 사항 =====
    private List<UrgentItem> importSupplements;     // 수입 보완/정정 (4건)
    private int importSupplementCount;              // 전체 건수
    private List<UrgentItem> exportSupplements;     // 수출 보완/정정 (4건)
    private int exportSupplementCount;
    private List<UrgentItem> importRejects;         // 수입 반려 (4건)
    private int importRejectCount;
    private List<UrgentItem> exportRejects;         // 수출 반려 (4건)
    private int exportRejectCount;

    // ===== Tab 2: 핵심 업무 지표 =====
    // ---- 기존 필드 (하위호환 유지) ----
    private int importRejectToday;
    private int importPhysicalWaiting;
    private int importReviewing;
    private int importAccepted;
    private int importReleaseWaiting;
    private int importCompletedToday;
    private int exportRejectToday;
    private int exportLoadingDeadline;      // 유지 (하위호환)
    private int exportWaitingCount;
    private int exportReviewing;
    private int exportInspectionWaiting;
    private int exportCorrectionAfter;
    private int exportCompletedToday;

    // ---- 신규 필드 (금일 기준 카드용) ----
    private int importPhysicalToday;        // 금일 수입 현품검사중
    private int importWaitingToday;         // 금일 수입 심사대기
    private int importReviewingToday;       // 금일 수입 심사중
    private int importPayCompletedToday;    // 금일 수입 납부완료
    private int importDeliveredToday;       // 금일 수입 출고완료

    private int exportPhysicalToday;        // 금일 수출 현품검사중
    private int exportWaitingToday;         // 금일 수출 심사대기
    private int exportReviewingToday;       // 금일 수출 심사중
    private int exportInspCompletedToday;   // 금일 수출 현품검사완료
    private int exportDeliveredToday;       // 금일 수출 출고완료

    // 통합
    private long taxPaymentDueToday;
    private int taxPaymentDueCount;
    private int newSubmitToday;
    private int newImportToday;
    private int newExportToday;
    private int supplementRemaining;
    private int supplementImportRemaining;
    private int supplementExportRemaining;
    // ★ 신규: 미완료 잔여
    private int totalPendingImport;
    private int totalPendingExport;

    // ===== Tab 3: 차트 =====
    private int totalApprovedImport;        // 기존 (전체)
    private int totalApprovedExport;        // 기존 (전체)
    // ★ 신규: 올해
    private int yearApprovedImport;
    private int yearApprovedExport;
    private List<MonthlyTax> monthlyTaxList;
    private List<MonthlyIssue> monthlyIssueList;
    private List<MonthlyVolume> monthlyVolumeList;

    // ===== Inner Classes =====
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UrgentItem {
        private String id;
        private String declNumber;
        private String status;
        private String itemName;
        private String submitDate;
        private String statusDate;
        private String docComment;
        private String type;
    }
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyTax {
        private String month;
        private long dutyTotal;
        private long vatTotal;
    }
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyIssue {
        private String month;
        private int rejectCount;
        private int supplementCount;
    }
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyVolume {
        private String month;
        private int importCount;
        private int exportCount;
    }
}