package kr.or.gtcs.dashboard.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import kr.or.gtcs.dto.DashboardDTO.*;

@Mapper
public interface DashboardMapper {

    // ===== 긴급 (기존 그대로) =====
    List<UrgentItem> selectImportSupplements(@Param("memId") Long memId, @Param("limit") int limit);
    int countImportSupplements(@Param("memId") Long memId);
    List<UrgentItem> selectExportSupplements(@Param("memId") Long memId, @Param("limit") int limit);
    int countExportSupplements(@Param("memId") Long memId);
    List<UrgentItem> selectImportRejects(@Param("memId") Long memId, @Param("limit") int limit);
    int countImportRejects(@Param("memId") Long memId);
    List<UrgentItem> selectExportRejects(@Param("memId") Long memId, @Param("limit") int limit);
    int countExportRejects(@Param("memId") Long memId);

    // ===== KPI (기존 그대로) =====
    int countImportRejectToday(@Param("memId") Long memId);
    int countImportByStatus(@Param("memId") Long memId, @Param("status") String status);
    int countImportCompletedToday(@Param("memId") Long memId);
    int countExportRejectToday(@Param("memId") Long memId);
    int countExportLoadingDeadline(@Param("memId") Long memId);
    int countExportByStatus(@Param("memId") Long memId, @Param("status") String status);
    int countExportCompletedToday(@Param("memId") Long memId);
    long sumTaxPaymentDueToday(@Param("memId") Long memId);
    int countTaxPaymentDueToday(@Param("memId") Long memId);
    int countNewImportToday(@Param("memId") Long memId);
    int countNewExportToday(@Param("memId") Long memId);

    // ===== 차트 (기존 그대로) =====
    int countTotalApprovedImport(@Param("memId") Long memId);
    int countTotalApprovedExport(@Param("memId") Long memId);
    List<MonthlyTax> selectMonthlyTax(@Param("memId") Long memId);
    List<MonthlyIssue> selectMonthlyIssues(@Param("memId") Long memId);
    List<MonthlyVolume> selectMonthlyVolume(@Param("memId") Long memId);

    // ===== ★ 신규 메서드 (금일 기준) =====
    /** 금일 수입 특정 상태 건수 (TRUNC(STATUS_DATE) = TRUNC(SYSDATE)) */
    int countImportTodayByStatus(@Param("memId") Long memId, @Param("status") String status);
    /** 금일 수입 출고완료 */
    int countImportDeliveredToday(@Param("memId") Long memId);
    /** 금일 수출 특정 상태 건수 */
    int countExportTodayByStatus(@Param("memId") Long memId, @Param("status") String status);
    /** 금일 수출 출고완료 */
    int countExportDeliveredToday(@Param("memId") Long memId);
    /** 수입 미완료 잔여 (APPROVED, DELIVERED 제외) */
    int countImportPending(@Param("memId") Long memId);
    /** 수출 미완료 잔여 */
    int countExportPending(@Param("memId") Long memId);
    /** 올해 수입 승인 건수 */
    int countYearApprovedImport(@Param("memId") Long memId);
    /** 올해 수출 승인 건수 */
    int countYearApprovedExport(@Param("memId") Long memId);
}