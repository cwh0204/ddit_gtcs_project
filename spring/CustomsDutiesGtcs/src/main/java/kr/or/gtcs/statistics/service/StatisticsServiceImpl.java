package kr.or.gtcs.statistics.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import kr.or.gtcs.commons.exception.SystemFailureException;
import kr.or.gtcs.statistics.mapper.StatisticsMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatisticsServiceImpl implements StatisticsService {

    private final StatisticsMapper statisticsMapper;

    @Override
    public List<Map<String, Object>> findZoneInspectionStats(String startDate, String endDate, String declType) {
        return statisticsMapper.selectZoneInspectionStats(startDate, endDate, declType);
    }
    
    @Override
    public Map<String, Object> findWarehouseShareStats(String startDate, String endDate, String declType) {
        return statisticsMapper.selectWarehouseShareStats(startDate, endDate, declType);
    }
    
    /**
     * 로그 기반 대시보드 누적 통계 및 반출 비율 조회
     * @param startDate 시작일
     * @param endDate 종료일
     * @param declType 신고 타입
     * @return 가공된 통계 데이터 (퍼센트 포함)
     * @throws SystemFailureException 통계 데이터 조회 및 가공 중 오류 발생 시
     */
    @Override
    public Map<String, Object> findLogDashboardStats(String startDate, String endDate, String declType) {
        try {
            // 매퍼를 통해 DB에서 1차 집계된 통계 데이터를 가져옴
            Map<String, Object> stats = statisticsMapper.selectLogDashboardStats(startDate, endDate, declType);
            
            // 반출 승인 및 차단 건수 추출 (DB 반환값이 Number 타입이므로 안전하게 long으로 캐스팅)
            long approvedCount = ((Number) stats.getOrDefault("releaseApprovedCount", 0)).longValue();
            long rejectedCount = ((Number) stats.getOrDefault("releaseRejectedCount", 0)).longValue();
            
            // 전체 반출 요청 건수 계산
            long totalReleaseCount = approvedCount + rejectedCount;
            
            // 퍼센트 계산을 위한 변수 초기화
            double approvalRate = 0.0;
            double rejectionRate = 0.0;
            
            // 분모가 0이 아닐 경우에만 소수점 첫째 자리까지 퍼센트 계산 수행
            if (totalReleaseCount > 0) {
                approvalRate = Math.round(((double) approvedCount / totalReleaseCount * 100.0) * 10) / 10.0;
                // 오차 방지를 위해 차단율은 100에서 승인율을 차감하여 계산
                rejectionRate = Math.round((100.0 - approvalRate) * 10) / 10.0; 
            }
            
            // 프론트엔드 화면 출력용 가공 데이터 맵에 추가 세팅
            stats.put("releaseTotalCount", totalReleaseCount);
            stats.put("approvalRate", approvalRate);
            stats.put("rejectionRate", rejectionRate);
            
            return stats;
        } catch (Exception e) {
            e.printStackTrace();
            throw new SystemFailureException("로그 기반 대시보드 통계 조회 중 오류가 발생했습니다 관리자에게 문의하세요");
        }
    }

    /**
     * 마스터 기반 실시간 상태 현황 통계 조회
     * @param startDate 시작일
     * @param endDate 종료일
     * @param declType 신고 타입
     * @return 상태별 현재 건수 데이터
     * @throws SystemFailureException 통계 데이터 조회 중 오류 발생 시
     */
    @Override
    public Map<String, Object> findMasterDashboardStats(String startDate, String endDate, String declType) {
        try {
            return statisticsMapper.selectMasterDashboardStats(startDate, endDate, declType);
        } catch (Exception e) {
            e.printStackTrace();
            throw new SystemFailureException("마스터 기반 대시보드 통계 조회 중 오류가 발생했습니다. 관리자에게 문의하세요");
        }
    }
    
}
