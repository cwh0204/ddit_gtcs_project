package kr.or.gtcs.statistics.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.gtcs.statistics.service.StatisticsService;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*") 
@RestController
@RequestMapping("/rest/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    /**
     * 구역별(A~I) 현품검사중 및 현품검사완료 건수 조회 API
     * DTO나 ResponseEntity 없이 직관적으로 List<Map> 즉시 반환
     */
    @GetMapping("/zone-inspection")
    public List<Map<String, Object>> findZoneInspectionStats(
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate,
            @RequestParam(value = "declType", required = false, defaultValue = "ALL") String declType
    ) {
        return statisticsService.findZoneInspectionStats(startDate, endDate, declType);
    }
    
    /**
     * 국내, 보세 조건에 따른 점유율 및 건수 조회 API
     * 
     */
    @GetMapping("/warehouse-share")
    public Map<String, Object> findWarehouseShareStats(
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate,
            @RequestParam(value = "declType", required = false, defaultValue = "ALL") String declType
    ) {
        return statisticsService.findWarehouseShareStats(startDate, endDate, declType);
    }
    
    /**
     * 로그 기반 대시보드 누적 통계 (1번 막대 차트, 2번 도넛 차트용)
     * @param startDate 필터 시작일
     * @param endDate 필터 종료일
     * @param declType 수입/수출 필터 (기본값 ALL)
     * @return 가공된 통계 JSON 데이터
     */
    @GetMapping("/dashboard/log-stats")
    public Map<String, Object> getLogDashboardStats(
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate,
            @RequestParam(value = "declType", required = false, defaultValue = "ALL") String declType
    ) {
        return statisticsService.findLogDashboardStats(startDate, endDate, declType);
    }

    /**
     * 마스터 기반 실시간 상태 통계 (3번 하단 차트용)
     * @param startDate 필터 시작일
     * @param endDate 필터 종료일
     * @param declType 수입/수출 필터 (기본값 ALL)
     * @return 상태별 건수 JSON 데이터
     */
    @GetMapping("/dashboard/master-stats")
    public Map<String, Object> getMasterDashboardStats(
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate,
            @RequestParam(value = "declType", required = false, defaultValue = "ALL") String declType
    ) {
        return statisticsService.findMasterDashboardStats(startDate, endDate, declType);
    }
    
}