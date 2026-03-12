package kr.or.gtcs.log.warehousestocklog.service;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.gtcs.commons.exception.SystemFailureException;
import kr.or.gtcs.dto.WarehouseHistoryDTO;
import kr.or.gtcs.dto.WarehouseStockDTO;
import kr.or.gtcs.dto.WarehouseStockLogDTO;
import kr.or.gtcs.log.warehousestocklog.mapper.WarehouseStockLogMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WarehouseStockLogServiceImpl implements WarehouseStockLogService {

    private final WarehouseStockLogMapper logMapper;

    /**
     * 창고 재고 변경 이력(로그) 등록
     * @param stockDTO 원본 재고 데이터
     * @param actionType 수행된 작업 유형 (예: IMP_RPT, EXP_RPT 등)
     * @throws SystemFailureException 로그 저장 중 DB 오류 발생 시
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void registerLog(WarehouseStockDTO stockDTO, String actionType) {
        try {
            WarehouseStockLogDTO logDTO = new WarehouseStockLogDTO();
            
            // 원본 DTO의 데이터를 로그 DTO로 깊은 복사
            BeanUtils.copyProperties(stockDTO, logDTO);
          
            logDTO.setActionType(actionType);
            logDTO.setWorkerId(stockDTO.getMemId());

            logMapper.insertStockLog(logDTO);
        } catch (Exception e) {
            // 로그 저장이 실패하면 메인 트랜잭션(창고 반입/반출 등)도 롤백되도록 예외 던짐
            throw new SystemFailureException("창고 재고 변경 이력(로그) 기록 중 시스템 오류가 발생했습니다.");
        }
    }
    
    @Override
    public List<WarehouseHistoryDTO> findWarehouseLogList(String declNo) {
        return logMapper.selectWarehouseLogListByDeclNo(declNo);
    }
    
}