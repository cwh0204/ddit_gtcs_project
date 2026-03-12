package kr.or.gtcs.statistics.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface StatisticsMapper {
    // A~I 구역별 현품검사 현황 통계 가져오기
	public List<Map<String, Object>> selectZoneInspectionStats(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("declType") String declType
    );
	
	//구역별 점유율
	public Map<String, Object> selectWarehouseShareStats(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("declType") String declType
    );
	
	/**
     * 로그 기반 대시보드 통계 조회 (누적 진행 현황 및 반출 비율)
     * @param startDate 조회 시작일 (ACTION_DATE 기준)
     * @param endDate 조회 종료일 (ACTION_DATE 기준)
     * @param declType 수입(IMPORT), 수출(EXPORT), 전체(ALL) 필터
     * @return 단계별 누적 처리 건수 맵
     */
    public Map<String, Object> selectLogDashboardStats(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("declType") String declType
    );

    /**
     * 마스터 기반 대시보드 통계 조회 (실시간 상태 현황)
     * @param startDate 조회 시작일 (SUBMIT_DATE 기준)
     * @param endDate 조회 종료일 (SUBMIT_DATE 기준)
     * @param declType 수입(IMPORT), 수출(EXPORT), 전체(ALL) 필터
     * @return 현재 신고서 상태별 건수 맵
     */
    public Map<String, Object> selectMasterDashboardStats(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("declType") String declType
    );
	
	
}