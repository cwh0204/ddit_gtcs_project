package kr.or.gtcs.exportmaster.service;

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
import kr.or.gtcs.dto.ExportMasterDTO;
import kr.or.gtcs.exportmaster.mapper.ExportMasterMapper;
import kr.or.gtcs.log.exportlog.service.ExportMasterLogService;
import kr.or.gtcs.util.AiDateEngine;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExportMasterServiceImpl implements ExportMasterService{
	
	private final ExportMasterMapper expMapper;
	private final ExportMasterLogService logService;
	private final AiDocCheckMapper aiDocMapper;
	private final AiDateEngine aiEngine;
	private final AttachentsService attService;
	@Autowired
	private ObjectMapper objectMapper;
	
	/**
	 *	수출 신고서 작성을 하기위한 서비스 메서드
	 *	@Param  master 수출 신고서 양식
	 *			invoiceFile 인보이스 파일
	 *			pakinglistFile 패킹리스트 파일
	 *			blFile Bl 파일
	 *			outherFile 기타파일
	 *	@throws SystemFailureException AI 분석 실패 및 DB 연동 오류 시 발생
	 */
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void registerExportMaster(ExportMasterDTO master, MultipartFile invoiceFile, MultipartFile packinglistFile,
			MultipartFile blFile, MultipartFile otherFile) {
		try {
			master.setDelayYn("N");
			expMapper.insertExportMaster(master);
			String refId = master.getExportNumber();
			Map<String, MultipartFile> files = new HashMap<>();
			files.put("invoice", invoiceFile);
			files.put("packinglist", packinglistFile);
			files.put("bl", blFile);
			files.put("other", otherFile);
			attService.uploadMultipleFiles(refId, "export", files);
	        String aiJosonContent = aiEngine.aiDocAnalyzer(master);
	        ExportMasterDTO saved = expMapper.selectExportMasterByNumber(master.getExportNumber());
	        logService.registerLog(saved, "REG");
			AiDocCheckDTO docCheck = objectMapper.readValue(aiJosonContent, AiDocCheckDTO.class);
			docCheck.setDocNumber(master.getExportNumber());
			aiDocMapper.insertAiDocCheck(docCheck);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
			throw new SystemFailureException("AI 분석 시스템 통신 중 오류가 발생했습니다");
		} catch (Exception e) {
			e.printStackTrace();
			throw new SystemFailureException("시스템 오류가 발생했습니다 관리자에게 문의하세요");
		}
	}
	
	/**
	 * 조건에 따른 수출 신고서 목록 조회
	 * @param memId   사용자 ID
	 * @param status  조회할 신고서 상태
	 * @param cri     페이징 및 검색 기준
	 * @param memRole 사용자 권한
	 * @return 수출 신고서 목록 (List)
	 * @throws SystemFailureException AI 분석 실패 및 DB 연동 오류 시 발생
	 */
	@Override
	public List<ExportMasterDTO> findAllExportMaster(Integer memId, String status, CriteriaDTO cri, String memRole) {
		
		try {			
			return expMapper.selectListExportMaster(memId, status, cri, memRole);
		}catch (Exception e) {
			throw new SystemFailureException("시스템 오류가 발생했습니다 관리자에게 문의하세요");
		}
	}

	/**
	 * 특정 수출 신고서 상세 조회
	 * @param exportId 조회할 수출 신고 번호
	 * @param memRole  조회자 권한
	 * @return 상세 정보를 담은 DTO
	 * @throws SystemFailureException AI 분석 실패 및 DB 연동 오류 시 발생
	 */
	@Override
	public ExportMasterDTO findExportMaster(String exportId, String memRole) {
		
		try {
			return expMapper.selectExportMaster(exportId, memRole);
		}catch (Exception e) {
			throw new SystemFailureException("시스템 오류가 발생했습니다 관리자에게 문의하세요");
		}
	}

	/**
	 * 수출 신고서 상태 및 검토 의견 수정 (승인/반려 등)
	 * @param exportnumber 수출 신고 번호
	 * @param status       변경할 상태 값
	 * @param docComment   AI 검토 의견 및 피드백
	 * @param checkId      AI 검토 내역 ID
	 * @throws SystemFailureException AI 분석 실패 및 DB 연동 오류 시 발생
	 */
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void modifyExportMasterStatus(String exportnumber, String status, String docComment, String checkId) {
		
		try {
			expMapper.updateExportMasterStatus(exportnumber, status);
			aiDocMapper.updateAiDocComment(checkId, docComment);
			//로그
			ExportMasterDTO tempDto = expMapper.selectExportMasterByNumber(exportnumber);
            ExportMasterDTO updatedMaster = expMapper.selectExportMaster(tempDto.getExportId(), "SYSTEM");
            
            if (updatedMaster != null) {
                logService.registerLog(updatedMaster, status);
            }
		
		}catch (Exception e) {
			e.printStackTrace();
			throw new SystemFailureException("시스템 오류가 발생했습니다 관리자에게 문의하세요");
		}
	}

	
	/**
	 * 기존 수출 신고서 정보 및 첨부 파일 수정
	 * @param master          수정할 신고서 데이터
	 * @param invoiceFile     수정된 인보이스 파일
	 * @param packinglistFile 수정된 패킹리스트 파일
	 * @param blFile          수정된 B/L 파일
	 * @param otherFile       수정된 기타 서류
	 * @throws SystemFailureException AI 분석 실패 및 DB 연동 오류 시 발생
	 */
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void modifyExportMaster(ExportMasterDTO master, MultipartFile invoiceFile, MultipartFile packinglistFile,
			MultipartFile blFile, MultipartFile otherFile) {
		
		try {
			expMapper.updateExportMaster(master);
			//로그
			logService.registerLog(master, "MOD");
			String refId = master.getExportNumber();
			Map<String, MultipartFile> files = new HashMap<>();
			files.put("invoice", invoiceFile);
			files.put("packinglist", packinglistFile);
			files.put("bl", blFile);
			files.put("other", otherFile);
			attService.uploadMultipleFiles(refId, "export", files);
	        String aiJosonContent = aiEngine.aiDocAnalyzer(master);
			AiDocCheckDTO docCheck = objectMapper.readValue(aiJosonContent, AiDocCheckDTO.class);
			docCheck.setDocNumber(master.getExportNumber());
			aiDocMapper.updateAiDocCheck(docCheck);
		} catch (JsonProcessingException e) {
			throw new SystemFailureException("AI 분석 시스템 통신 중 오류가 발생했습니다");
		} catch (Exception e) {
			throw new SystemFailureException("시스템 오류가 발생했습니다 관리자에게 문의하세요");
		}
	}

	/**
	 * 창고 검수 단계에서의 수출 신고서 상태 업데이트
	 * @param masterDTO 변경할 상태 정보가 포함된 DTO
	 * @throws SystemFailureException DB 연동 오류 시 발생
	 */
	@Override
	public void modifyExportMasterWareHouseStatus(ExportMasterDTO masterDTO) {
		try {
			expMapper.updateExportMasterStatus(masterDTO.getExportNumber(), masterDTO.getStatus());
            ExportMasterDTO tempDto = expMapper.selectExportMasterByNumber(masterDTO.getExportNumber());
            ExportMasterDTO updatedMaster = expMapper.selectExportMaster(tempDto.getExportId(), "SYSTEM");
            
            if (updatedMaster != null) {
                logService.registerLog(updatedMaster, masterDTO.getStatus());
            }
		} catch (Exception e) {
			e.printStackTrace();
			throw new SystemFailureException("창고 상태 업데이트 중 시스템 오류가 발생했습니다.");
		}
	}

	/**
	 * 수출 신고서 담당 세관원 변경을 위한 메서드
	 * @param MasterDTO 담당 세관원 id가 포함된 DTO
	 * @throws SystemFailureException DB 연동 오류 시 발생
	 */
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void modifyOfficer(ExportMasterDTO master) {
		try {
            // 수동 배정 업데이트
			int result = expMapper.updateOfficer(master);
            
            if (result == 0) {
                throw new RuntimeException("수동 배정에 실패했습니다.");
            }

            // SYSTEM 마스터키로 최신 정보 가져오기
            ExportMasterDTO updatedMaster = expMapper.selectExportMaster(master.getExportId(), "SYSTEM");
            
            // 수동 배정 로그 기록
            if (updatedMaster != null) {
                logService.registerLog(updatedMaster, "MANUAL_ASSIGN");
            }
		} catch (Exception e) {
			e.printStackTrace();
			throw new SystemFailureException("담당자 배정 중 시스템 오류가 발생했습니다.");
		}
	}
}
