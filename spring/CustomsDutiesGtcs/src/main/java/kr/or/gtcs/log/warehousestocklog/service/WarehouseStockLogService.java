package kr.or.gtcs.log.warehousestocklog.service;

import java.util.List;

import kr.or.gtcs.dto.WarehouseHistoryDTO;
import kr.or.gtcs.dto.WarehouseStockDTO;

public interface WarehouseStockLogService {
	/**
     * 재고 변경 이력을 기록
     * @param stockDTO 원본 재고 데이터 (방금 insert된 데이터)
     * @param actionType 행동 유형 (예: IMP_RPT, EXP_RPT)
     */
    void registerLog(WarehouseStockDTO stockDTO, String actionType);
    
    List<WarehouseHistoryDTO> findWarehouseLogList(String declNo);
    
}
