package kr.or.gtcs.log.exportlog.service;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.gtcs.commons.exception.SystemFailureException;
import kr.or.gtcs.dto.ExportMasterDTO;
import kr.or.gtcs.dto.ExportMasterLogDTO;
import kr.or.gtcs.log.exportlog.mapper.ExportMasterLogMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExportMasterLogServiceImpl implements ExportMasterLogService {
    
    private final ExportMasterLogMapper logMapper;

    /**
     * 수출 신고서 상태 변경 및 액션 이력(로그) 등록
     * @param master 수출 신고서 상세 정보가 담긴 DTO
     * @param actionType 수행된 작업 유형 (예: REG, MOD, ACCEPTED 등)
     * @throws SystemFailureException 로그 저장 중 DB 오류 발생 시
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void registerLog(ExportMasterDTO master, String actionType) {
        try {
            ExportMasterLogDTO logDTO = new ExportMasterLogDTO();
            
            // 원본 DTO의 모든 데이터를 로그 DTO로 깊은 복사 (스냅샷 생성)
            BeanUtils.copyProperties(master, logDTO);

            logDTO.setActionType(actionType);
            logDTO.setWorkerId(master.getMemId());

            logMapper.insertExportMasterLog(logDTO);
        } catch (Exception e) {
            // 로그 저장이 실패하면 메인 트랜잭션(신고서 등록 등)도 함께 롤백시키기 위해 예외를 던짐
            throw new SystemFailureException("수출 신고서 이력(로그) 기록 중 시스템 오류가 발생했습니다.");
        }
    }
}