package kr.or.gtcs.importmaster.controller;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import kr.or.gtcs.commons.exception.SystemFailureException;
import kr.or.gtcs.dto.CriteriaDTO;
import kr.or.gtcs.dto.ImportMasterDTO;
import kr.or.gtcs.importmaster.service.ImportMasterService;
import kr.or.gtcs.security.auth.MemberDTOWrapper;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/rest/import")
@RequiredArgsConstructor
public class ImportMasterController {
	
	private final ImportMasterService service;
	
	/**
	 * 신규 수입 신고서 등록 (데이터 + 다중 파일 업로드)
	 * @param master          수입 신고 데이터 (JSON Part)
	 * @param invoiceFile     송장 파일
	 * @param packinglistFile 포장명세서 파일
	 * @param blFile          선하증권 파일
	 * @param otherFile       기타 증빙 서류
	 * @param member          로그인된 사용자 정보 (Security Context)
	 * @throws SystemFailureException AI 분석 실패 및 DB 연동 오류 시 발생
	 */
	@PostMapping
	public void registerImportMaster(
			@Valid @RequestPart("data") ImportMasterDTO master,
	        @RequestPart(value = "invoiceFile", required = false) MultipartFile invoiceFile,
	        @RequestPart(value = "packinglistFile", required = false) MultipartFile packinglistFile,
	        @RequestPart(value = "blFile", required = false) MultipartFile blFile,
	        @RequestPart(value = "otherFile", required = false) MultipartFile otherFile,
	        @AuthenticationPrincipal MemberDTOWrapper member
	) {
		master.setMemId(member.getRealUser().getMemId());
		service.registerImportMaster(master, invoiceFile, packinglistFile, blFile, otherFile);
	}
	
	/**
	 * 수입 신고서 목록 조회 (페이징 및 조건 검색)
	 * @param member  로그인된 사용자 정보
	 * @param status  조회할 신고서 상태
	 * @param cri     페이징 정보 (Criteria)
	 * @return 조건에 맞는 수입 신고서 목록
	 * @throws SystemFailureException DB 연동 오류 시 발생
	 */
	@GetMapping
	public List<ImportMasterDTO> findAllImportMaster(
			@AuthenticationPrincipal MemberDTOWrapper member,
			String status,
			CriteriaDTO cri
	) {

	    if (cri.getPageNum() <= 0) {
	        cri.setPageNum(1);
	    }
	    return service.findAllImportMaster(member.getRealUser().getMemId(), status, cri, member.getRealUser().getMemRole());
	}
	
	/**
	 * 특정 수입 신고서 상세 조회
	 * @param importId 조회할 수입 신고 번호
	 * @param member   로그인된 사용자 정보
	 * @return 상세 정보를 담은 DTO
	 * @throws SystemFailureException DB 연동 오류 시 발생
	 */
	@GetMapping("/{importId}")
	public ImportMasterDTO findImportMaster(
			@PathVariable("importId") String importId,
			@AuthenticationPrincipal MemberDTOWrapper member
	) {
		return service.findImportMaster(importId, member.getRealUser().getMemRole());
	}
	
	/**
	 * 세관원 심사 결과 및 상태 업데이트 (피드백)
	 */
	@PostMapping("/feedback")
	public void modifyImportMasterStatus(@RequestBody Map<String, String> params) {
	    String importNumber = params.get("importNumber");
	    String status = params.get("status");
	    String docComment = params.get("docComment");
	    String checkId = params.get("checkId");
	    String officerId = params.get("officerId");
	    
	    service.modifyImportMasterStatus(importNumber, status, docComment, checkId, officerId);
	}
	
	/**
	 * 기존 수입 신고서 정보 및 첨부 파일 수정
	 */
	@PutMapping("/modify")
    public void modifyImportMaster(
    		@Valid @RequestPart("data") ImportMasterDTO master,
	        @RequestPart(value = "invoiceFile", required = false) MultipartFile invoiceFile,
	        @RequestPart(value = "packinglistFile", required = false) MultipartFile packinglistFile,
	        @RequestPart(value = "blFile", required = false) MultipartFile blFile,
	        @RequestPart(value = "otherFile", required = false) MultipartFile otherFile		
    ) {
		service.modifyImportMaster(master, invoiceFile, packinglistFile, blFile, otherFile);
	}
	
	/**
	 * 창고 검수 단계에서의 수입 신고서 상태 업데이트
	 * @param masterDTO 상태 정보를 포함한 DTO
	 */
	@PutMapping("/whmangercheck")
	public void modifyImportMasterWhmangerCheck(@RequestBody ImportMasterDTO masterDTO) {
	    service.modifyImportMasterWhmangerCheck(masterDTO);
	}
	
	/**
	 * 수입 신고서 수동 배정 (세관원 직접 지정 및 지연 상태 초기화)
	 * @param importId 경로 변수(신고서 ID)
	 * @param masterDTO officerId 정보를 포함한 DTO
	 */
	@PutMapping("/{importId}/assign")
	public void assignOfficerManually(
			@PathVariable("importId") String importId,
			@RequestBody ImportMasterDTO masterDTO
	) {
		masterDTO.setImportId(importId); 
		service.assignOfficerManually(masterDTO);
	}
	
	/**
	 * 세관원 목록 및 현재 업무량 조회 (수동 배정 모달창 용도)
	 * GET /rest/import/officers/workload
	 */
	@GetMapping("/officers/workload")
	public List<Map<String, Object>> getOfficerWorkloadList() {
	    return service.findOfficerWorkloadList();
	}
	
	/**
	 * 수입 신고서 상태별 건수 조회 (담당자 배정 페이지 탭 카운트용)
	 * GET /rest/import/status-counts
	 * 응답: [{ "status": "REVIEWING", "count": 14 }, ...]
	 */
	@GetMapping("/status-counts")
	public List<Map<String, Object>> getStatusCountList(
	        @AuthenticationPrincipal MemberDTOWrapper member
	) {
	    return service.findStatusCountList(
	        member.getRealUser().getMemId(),
	        member.getRealUser().getMemRole()
	    );
	}
}