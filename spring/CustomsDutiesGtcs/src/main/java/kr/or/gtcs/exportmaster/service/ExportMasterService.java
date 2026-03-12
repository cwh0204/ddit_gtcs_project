package kr.or.gtcs.exportmaster.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import kr.or.gtcs.dto.CriteriaDTO;
import kr.or.gtcs.dto.ExportMasterDTO;

public interface ExportMasterService {
	public void registerExportMaster(ExportMasterDTO master,MultipartFile invoiceFile,
			MultipartFile packinglistFile,
			MultipartFile blFile,
			MultipartFile otherFile);
	
	public List<ExportMasterDTO> findAllExportMaster(
			Integer memId,
			String status,
			CriteriaDTO cri,
			String memRole
	);
	
	public ExportMasterDTO findExportMaster(String importId, String memRole);
	
	public void modifyExportMaster(
			ExportMasterDTO master,
			MultipartFile invoiceFile,
			MultipartFile packinglistFile,
			MultipartFile blFile,
			MultipartFile otherFile);
	
	public void modifyExportMasterStatus(String exportnumber, String status, String docComment, String checkId);
	
	public void modifyExportMasterWareHouseStatus(ExportMasterDTO masterDTO);
	
	public void modifyOfficer(ExportMasterDTO master);
}
