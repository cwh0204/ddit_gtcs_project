package kr.or.gtcs.importmaster.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.or.gtcs.aidoccheck.mapper.AiDocCheckMapper;
import kr.or.gtcs.attachents.service.AttachentsService;
import kr.or.gtcs.commons.exception.SystemFailureException;
import kr.or.gtcs.dto.AiDocCheckDTO;
import kr.or.gtcs.dto.CriteriaDTO;
import kr.or.gtcs.dto.ImportMasterDTO;
import kr.or.gtcs.importmaster.mapper.ImportMasterMapper;
import kr.or.gtcs.importtaxpayment.service.ImportTaxPaymentService;
import kr.or.gtcs.log.importlog.service.ImportMasterLogService;
import kr.or.gtcs.util.AiDateEngine;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ImportMasterServiceImpl implements ImportMasterService {

    private final ImportMasterMapper impMapper;
    private final AiDocCheckMapper aiDocMapper;
    private final AiDateEngine aiEngine;
    private final AttachentsService attService;
    @Autowired
    private ObjectMapper objectMapper;
    private final ImportTaxPaymentService taxService;
    private final ImportMasterLogService logService;

    /**
     * 신규 수입 신고서 등록 및 AI 분석 요청
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void registerImportMaster(ImportMasterDTO master, MultipartFile invoiceFile, MultipartFile packinglistFile,
            MultipartFile blFile, MultipartFile otherFile) {
        
        try {
            master.setStatus("WAITING");
            master.setDelayYn("N");
            impMapper.insertImportMaster(master);
            
            ImportMasterDTO saved = impMapper.selectImportMasterImportId(master.getImportId());
            String refId = saved.getImportNumber();
            
            Integer leastBusyOfficerId = impMapper.selectLeastBusyOfficer();
            
            if (leastBusyOfficerId != null) {
                impMapper.updateAutoAssign(refId, leastBusyOfficerId);
                saved.setOfficerId(leastBusyOfficerId);
            }
            
            logService.registerLog(saved, saved.getStatus());
            
            Map<String, MultipartFile> files = new HashMap<>();
            files.put("invoice", invoiceFile);
            files.put("packinglist", packinglistFile);
            files.put("bl", blFile);
            files.put("other", otherFile);

            attService.uploadMultipleFiles(refId, "import", files);

            String aiJosonContent = aiEngine.aiDocAnalyzer(master);
            AiDocCheckDTO docCheck = objectMapper.readValue(aiJosonContent, AiDocCheckDTO.class);
            docCheck.setDocNumber(refId);
            aiDocMapper.insertAiDocCheck(docCheck);
            
        } catch (JsonProcessingException e) {
        	e.printStackTrace();
            throw new SystemFailureException("AI 분석 시스템 통신 중 오류가 발생했습니다");
        } catch (Exception e) {
        	e.printStackTrace();
            throw new SystemFailureException("수입 신고서 등록 중 시스템 오류가 발생했습니다.");
        }
    }

    /**
     * 수입 신고서 목록 조회 (조건 및 페이징)
     */
    @Override
    public List<ImportMasterDTO> findAllImportMaster(Integer memId, String status, CriteriaDTO cri, String memRole) {
        try {
            return impMapper.selectListImportMaster(memId, status, cri, memRole);
        } catch (Exception e) {
        	e.printStackTrace();
            throw new SystemFailureException("목록 조회 중 시스템 오류가 발생했습니다.");
        }
    }

    /**
     * 특정 수입 신고서 상세 조회
     */
    @Override
    public ImportMasterDTO findImportMaster(String importId, String memRole) {
        try {
            return impMapper.selectImportMaster(importId, memRole);
        } catch (Exception e) {
        	e.printStackTrace();
            throw new SystemFailureException("상세 조회 중 시스템 오류가 발생했습니다.");
        }
    }

    /**
     * 세관원 심사 결과 업데이트 및 세금 고지서 발행
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void modifyImportMasterStatus(String importNumber, String status, String docComment, String checkId, String officerId) {
        try {
            if (checkId != null) {
                aiDocMapper.updateAiDocComment(checkId, docComment);
            }

            impMapper.updateImportMasterStatus(importNumber, status);

            String importId = impMapper.selectImportIdByNumber(importNumber);
            
            // SYSTEM 으로 변경 (로그용 마스터 키)
            ImportMasterDTO updatedMaster = impMapper.selectImportMaster(importId, "SYSTEM");
            
            if (updatedMaster != null) {
                logService.registerLog(updatedMaster, status); 
            } else {
                throw new SystemFailureException("업데이트된 문서 정보를 찾을 수 없어 로그 기록을 생략합니다.");
            }

            if ("ACCEPTED".equals(status)) {
                if (importId != null) {
                    taxService.generateTaxBill(importId, officerId);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new SystemFailureException("상태 업데이트 중 시스템 오류가 발생했습니다.");
        }
    }
    
    /**
     * 수입 신고서 수정 및 첨부 파일 재업로드
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void modifyImportMaster(ImportMasterDTO master, MultipartFile invoiceFile, MultipartFile packinglistFile,
            MultipartFile blFile, MultipartFile otherFile) {

        try {
            impMapper.updateImportMaster(master);
            logService.registerLog(master, "MOD");
            String refId = master.getImportNumber();

            Map<String, MultipartFile> files = new HashMap<>();
            files.put("invoice", invoiceFile);
            files.put("packinglist", packinglistFile);
            files.put("bl", blFile);
            files.put("other", otherFile);

            attService.uploadMultipleFiles(refId, "import", files);

            String aiJosonContent = aiEngine.aiDocAnalyzer(master);
            AiDocCheckDTO docCheck = objectMapper.readValue(aiJosonContent, AiDocCheckDTO.class);
            docCheck.setDocNumber(master.getImportNumber());
            aiDocMapper.updateAiDocCheck(docCheck);
            
        } catch (JsonProcessingException e) {
        	e.printStackTrace();
        	throw new SystemFailureException("AI 분석 시스템 통신 중 오류가 발생했습니다");
        } catch (Exception e) {
        	e.printStackTrace();
            throw new SystemFailureException("수입 신고서 수정 중 시스템 오류가 발생했습니다.");
        }
    }

    /**
     * 창고 검수 단계에서의 수입 신고서 상태 업데이트 (DTO 사용)
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void modifyImportMasterWhmangerCheck(ImportMasterDTO masterDTO) {
        try {
            impMapper.updateImportMasterStatus(masterDTO.getImportNumber(), masterDTO.getStatus());
            
            String importId = impMapper.selectImportIdByNumber(masterDTO.getImportNumber());
            
            //  WH_MANAGER -> SYSTEM 으로 변경 (권한 제어 통과)
            ImportMasterDTO updatedMaster = impMapper.selectImportMaster(importId, "SYSTEM");
            
            if(updatedMaster != null) {
                logService.registerLog(updatedMaster, masterDTO.getStatus());
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new SystemFailureException("창고 상태 업데이트 중 시스템 오류가 발생했습니다.");
        }
    }
    
    /**
     * 수동 배정 (담당자 변경 + 시간 리셋 + 지연 해제 + 로그 기록)
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void assignOfficerManually(ImportMasterDTO masterDTO) {
        try {
            // 수동 배정 업데이트
            int result = impMapper.updateManualAssign(masterDTO);

            if (result == 0) {
                throw new RuntimeException("수동 배정에 실패했습니다. 대상 수입신고서를 찾을 수 없습니다.");
            }

            // 업데이트가 완료된 최신 데이터(스냅샷) 다시 불러오기
            ImportMasterDTO updatedMaster = impMapper.selectImportMasterImportId(String.valueOf(masterDTO.getImportId()));
            
            // 로그 테이블에 수동 배정 이력 기록
            if (updatedMaster != null) {
                // 로그 액션 타입은 'MANUAL_ASSIGN' (수동 배정)으로 지정
                logService.registerLog(updatedMaster, "MANUAL_ASSIGN");
            }

        } catch (Exception e) {
        	e.printStackTrace();
            throw new SystemFailureException("수동 배정 업데이트 중 시스템 오류가 발생했습니다.");
        }
    }
    
    @Override
    public List<Map<String, Object>> findOfficerWorkloadList() {
        try {
            return impMapper.selectOfficerWorkloadList();
        } catch (Exception e) {
        	e.printStackTrace();
            throw new SystemFailureException("세관원 목록 조회 중 오류가 발생했습니다.");
        }
    }
    
    @Override
    public List<Map<String, Object>> findStatusCountList(Integer memId, String memRole) {
        try {
            return impMapper.selectStatusCountList(memId, memRole);
        } catch (Exception e) {
            e.printStackTrace();
            throw new SystemFailureException("상태별 건수 조회 중 오류가 발생했습니다.");
        }
    }
    
}