package kr.or.gtcs.statistics.service;

import java.util.List;
import java.util.Map;

public interface StatisticsService {
	
	public List<Map<String, Object>> findZoneInspectionStats(String startDate, String endDate, String declType);

	public Map<String, Object> findWarehouseShareStats(String startDate, String endDate, String declType);

	/**
     * 로그 기반 대시보드 누적 통계 및 반출 비율 조회
     */
    public Map<String, Object> findLogDashboardStats(String startDate, String endDate, String declType);
    
    /**
     * 마스터 기반 실시간 상태 현황 통계 조회
     */
    public Map<String, Object> findMasterDashboardStats(String startDate, String endDate, String declType);
    
    
    /**
     * SLA 대시보드 종합 통계 조회 (AI 분석, 세액, 지연율)
     */
    public Map<String, Object> findSlaDashboardStats(String startDate, String endDate, String declType);
}