package kr.or.gtcs.dashboard.service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.or.gtcs.dashboard.mapper.DashboardMapper;
import kr.or.gtcs.dto.DashboardDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {
    private final DashboardMapper mapper;
    @Override
    public DashboardDTO getDashboardData(Long memId) {
        DashboardDTO dto = new DashboardDTO();
        try { fillUrgent(dto, memId); }  catch (Exception e) { log.warn("긴급 데이터 실패", e); }
        try { fillKpi(dto, memId); }     catch (Exception e) { log.warn("KPI 데이터 실패", e); }
        try { fillChart(dto, memId); }   catch (Exception e) { log.warn("차트 데이터 실패", e); }
        return dto;
    }
    private void fillUrgent(DashboardDTO dto, Long memId) {
        dto.setImportSupplements(mapper.selectImportSupplements(memId, 4));
        dto.setImportSupplementCount(mapper.countImportSupplements(memId));
        dto.setExportSupplements(mapper.selectExportSupplements(memId, 4));
        dto.setExportSupplementCount(mapper.countExportSupplements(memId));
        dto.setImportRejects(mapper.selectImportRejects(memId, 4));
        dto.setImportRejectCount(mapper.countImportRejects(memId));
        dto.setExportRejects(mapper.selectExportRejects(memId, 4));
        dto.setExportRejectCount(mapper.countExportRejects(memId));
    }
    private void fillKpi(DashboardDTO dto, Long memId) {
        // ========== 기존 필드 (변경 없음 - 하위호환) ==========
        dto.setImportRejectToday(mapper.countImportRejectToday(memId));
        dto.setImportPhysicalWaiting(mapper.countImportByStatus(memId, "PHYSICAL"));
        dto.setImportReviewing(mapper.countImportByStatus(memId, "REVIEWING"));
        dto.setImportAccepted(mapper.countImportByStatus(memId, "PAY_COMPLETED"));
        dto.setImportReleaseWaiting(mapper.countImportByStatus(memId, "WAITING"));
        dto.setImportCompletedToday(mapper.countImportCompletedToday(memId));
        dto.setExportRejectToday(mapper.countExportRejectToday(memId));
        dto.setExportWaitingCount(mapper.countExportByStatus(memId, "WAITING"));
        dto.setExportReviewing(mapper.countExportByStatus(memId, "REVIEWING"));
        dto.setExportInspectionWaiting(mapper.countExportByStatus(memId, "PHYSICAL"));
        dto.setExportCorrectionAfter(mapper.countExportByStatus(memId, "SUPPLEMENT"));
        dto.setExportCompletedToday(mapper.countExportCompletedToday(memId));

        // ========== ★ 신규 필드 (금일 기준 6개씩) ==========
        // 수입 금일: 반려는 기존 importRejectToday 재사용
        dto.setImportPhysicalToday(mapper.countImportTodayByStatus(memId, "PHYSICAL"));
        dto.setImportWaitingToday(mapper.countImportTodayByStatus(memId, "WAITING"));
        dto.setImportReviewingToday(mapper.countImportTodayByStatus(memId, "REVIEWING"));
        dto.setImportPayCompletedToday(mapper.countImportTodayByStatus(memId, "PAY_COMPLETED"));
        dto.setImportDeliveredToday(mapper.countImportDeliveredToday(memId));

        // 수출 금일: 반려는 기존 exportRejectToday 재사용
        dto.setExportPhysicalToday(mapper.countExportTodayByStatus(memId, "PHYSICAL"));
        dto.setExportWaitingToday(mapper.countExportTodayByStatus(memId, "WAITING"));
        dto.setExportReviewingToday(mapper.countExportTodayByStatus(memId, "REVIEWING"));
        dto.setExportInspCompletedToday(mapper.countExportTodayByStatus(memId, "INSPECTION_COMPLETED"));
        dto.setExportDeliveredToday(mapper.countExportDeliveredToday(memId));

        // ========== 통합 (기존 + 신규) ==========
        dto.setTaxPaymentDueToday(mapper.sumTaxPaymentDueToday(memId));
        dto.setTaxPaymentDueCount(mapper.countTaxPaymentDueToday(memId));
        dto.setNewImportToday(mapper.countNewImportToday(memId));
        dto.setNewExportToday(mapper.countNewExportToday(memId));
        dto.setNewSubmitToday(dto.getNewImportToday() + dto.getNewExportToday());
        int si = mapper.countImportSupplements(memId);
        int se = mapper.countExportSupplements(memId);
        dto.setSupplementImportRemaining(si);
        dto.setSupplementExportRemaining(se);
        dto.setSupplementRemaining(si + se);
        // ★ 신규: 미완료 잔여
        dto.setTotalPendingImport(mapper.countImportPending(memId));
        dto.setTotalPendingExport(mapper.countExportPending(memId));
    }
    private void fillChart(DashboardDTO dto, Long memId) {
        // 기존
        dto.setTotalApprovedImport(mapper.countTotalApprovedImport(memId));
        dto.setTotalApprovedExport(mapper.countTotalApprovedExport(memId));
        // ★ 신규 (올해)
        dto.setYearApprovedImport(mapper.countYearApprovedImport(memId));
        dto.setYearApprovedExport(mapper.countYearApprovedExport(memId));
        dto.setMonthlyTaxList(mapper.selectMonthlyTax(memId));
        dto.setMonthlyIssueList(mapper.selectMonthlyIssues(memId));
        dto.setMonthlyVolumeList(mapper.selectMonthlyVolume(memId));
    }
}