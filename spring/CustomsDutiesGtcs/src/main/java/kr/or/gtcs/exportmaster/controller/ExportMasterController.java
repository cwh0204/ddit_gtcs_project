package kr.or.gtcs.exportmaster.controller;

import java.util.List;

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
import kr.or.gtcs.dto.CriteriaDTO;
import kr.or.gtcs.dto.ExportMasterDTO;
import kr.or.gtcs.exportmaster.service.ExportMasterService;
import kr.or.gtcs.security.auth.MemberDTOWrapper;
import kr.or.gtcs.util.FileUtils;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/rest/export")
@RequiredArgsConstructor
public class ExportMasterController {
	
	private final ExportMasterService service;
	private final FileUtils file;
	
	/**
	 * 신규 수출 신고서 등록 (데이터 + 다중 파일 업로드)
	 * @param master          수출 신고 데이터 (JSON Part)
	 * @param invoiceFile     송장 파일
	 * @param packinglistFile 포장명세서 파일
	 * @param blFile          선하증권 파일
	 * @param otherFile       기타 증빙 서류
	 * @param member          로그인된 사용자 정보 (Security Context)
	 */
	@PostMapping
	public void registerExportMaster(
			@Valid @RequestPart("data") ExportMasterDTO master,
			// 파일들은 JS의 appendFilesToFormData에서 지정한 이름과 맞춰야 함
	        @RequestPart(value = "invoiceFile", required = false) MultipartFile invoiceFile,
	        @RequestPart(value = "packinglistFile", required = false) MultipartFile packinglistFile,
	        @RequestPart(value = "blFile", required = false) MultipartFile blFile,
	        @RequestPart(value = "otherFile", required = false) MultipartFile otherFile,
	        @AuthenticationPrincipal MemberDTOWrapper member
	) 
	{
		master.setMemId(member.getRealUser().getMemId());
		service.registerExportMaster(master, invoiceFile, packinglistFile, blFile, otherFile);
	}
	
	/**
	 * 수출 신고서 전체 목록 조회 (페이징 및 검색 조건 포함)
	 * @param memId   사용자 ID (필요 시 필터링)
	 * @param status  신고서 상태 (승인, 반려, 대기 등)
	 * @param memRole 사용자 권한
	 * @param cri     페이징 정보 (페이지 번호 등)
	 * @return 수출 신고서 리스트
	 */
	@GetMapping
	public List<ExportMasterDTO> findAllExportMaster(
			@AuthenticationPrincipal MemberDTOWrapper member,
			String status,
			CriteriaDTO cri
	)
	
	{
	    if (cri.getPageNum() <= 0) {
	        cri.setPageNum(1);
	    }
	    return service.findAllExportMaster(member.getRealUser().getMemId(), status, cri, member.getRealUser().getMemRole());
	}
	
	/**
	 * 특정 수출 신고서 단건 조회
	 * @param exportId 조회할 신고 번호
	 * @param memRole  조회자 권한
	 * @return 신고서 상세 데이터
	 */
	@GetMapping("/{exportId}")
	public ExportMasterDTO findExportMaster(
			@PathVariable("exportId") String exportId,
			@AuthenticationPrincipal MemberDTOWrapper member
	) {
		
		return service.findExportMaster(exportId,member.getRealUser().getMemRole());
	}
	
	/**
	 * 검토 의견 반영 및 상태 변경 (승인/반려 피드백)
	 * @param exportNumber 수출 신고 번호
	 * @param status       변경할 상태
	 * @param docComment   AI 검토 의견 및 피드백 메시지
	 * @param checkId      AI 검토 내역 ID
	 */
	@PostMapping("/feedback")
	public void modifyExportMasterStatus (String exportNumber, String status, String docComment, String checkId) {
		service.modifyExportMasterStatus(exportNumber, status, docComment, checkId);
	}
	
	/**
	 * 기존 수출 신고서 정보 및 첨부 파일 수정
	 * @param master          수정할 신고 데이터 (JSON Part)
	 * @param invoiceFile     교체/추가된 송장 파일
	 * @param packinglistFile 교체/추가된 포장명세서 파일
	 * @param blFile          교체/추가된 선하증권 파일
	 * @param otherFile       교체/추가된 기타 서류
	 */
	@PutMapping("/modify")
    public void modifyExportMaster(
    		@Valid @RequestPart("data") ExportMasterDTO master,
			// 파일들은 JS의 appendFilesToFormData에서 지정한 이름과 맞춰야 함
	        @RequestPart(value = "invoiceFile", required = false) MultipartFile invoiceFile,
	        @RequestPart(value = "packinglistFile", required = false) MultipartFile packinglistFile,
	        @RequestPart(value = "blFile", required = false) MultipartFile blFile,
	        @RequestPart(value = "otherFile", required = false) MultipartFile otherFile) {
		service.modifyExportMaster(master, invoiceFile, packinglistFile, blFile, otherFile);
	}
	
	/**
	 * 창고 검수 단계 상태 업데이트
	 * @param masterDTO 상태 정보를 포함한 DTO
	 */
	@PutMapping("/warehouse/inspection")
	public void modifyExportMasterWareHouseStatus(@RequestBody ExportMasterDTO masterDTO) {
		service.modifyExportMasterWareHouseStatus(masterDTO);
	}
	
	/**
	 * 담당자 수동배정을 위한 메서드
	 * @param masterDTO officerId 변경할 담당자, exportId 신고서번호
	 */
	@PutMapping("/officer")
	public void modifyOfficer(@RequestBody ExportMasterDTO masterDTO) {
		service.modifyOfficer(masterDTO);
	}
}
