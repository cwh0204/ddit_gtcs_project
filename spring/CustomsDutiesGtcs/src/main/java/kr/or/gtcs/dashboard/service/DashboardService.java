package kr.or.gtcs.dashboard.service;

import kr.or.gtcs.dto.DashboardDTO;

public interface DashboardService {
    DashboardDTO getDashboardData(Long memId);
}