package kr.or.gtcs.importmaster.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import kr.or.gtcs.dto.CriteriaDTO;
import kr.or.gtcs.dto.ImportMasterDTO;

public interface ImportMasterService {
	
	/**
	 * 신규 수입 신고서 등록
	 */
	public void registerImportMaster(
			ImportMasterDTO master,
			MultipartFile invoiceFile,
			MultipartFile packinglistFile,
			MultipartFile blFile,
			MultipartFile otherFile);
	
	/**
	 * 수입 신고서 목록 조회
	 */
	public List<ImportMasterDTO> findAllImportMaster(
		    Integer memId,
		    String status,
		    CriteriaDTO cri,
		    String memRole
	);
	
	/**
	 * 특정 수입 신고서 상세 조회
	 */
	public ImportMasterDTO findImportMaster(String importId, String memRole);

	/**
	 * 수입 신고서 수정
	 */
	public void modifyImportMaster(
			ImportMasterDTO master,
			MultipartFile invoiceFile,
			MultipartFile packinglistFile,
			MultipartFile blFile,
			MultipartFile otherFile
	);
	
	/**
	 * 심사 결과 및 상태 업데이트
	 */
	public void modifyImportMasterStatus(String importNumber, String status, String docComment, String checkId, String officerId);
	
	/**
	 * 창고 관리자 반입/반출 상태 업데이트 (DTO로 받도록 변경)
	 */
	public void modifyImportMasterWhmangerCheck(ImportMasterDTO masterDTO);

	/**
	 * 수동 배정 (DTO로 받도록 변경)
	 */
	void assignOfficerManually(ImportMasterDTO masterDTO);

	
	/**
     * 세관원 목록 및 업무량 조회
     */
    List<Map<String, Object>> findOfficerWorkloadList();
    
    /**
     * 상태별 건수 조회 (담당자 배정 페이지 탭 카운트용)
     */
    List<Map<String, Object>> findStatusCountList(Integer memId, String memRole);
	
}