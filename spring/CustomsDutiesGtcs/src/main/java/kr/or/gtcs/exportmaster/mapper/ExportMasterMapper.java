package kr.or.gtcs.exportmaster.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.gtcs.dto.CriteriaDTO;
import kr.or.gtcs.dto.ExportMasterDTO;

@Mapper
public interface ExportMasterMapper {
	public int insertExportMaster(ExportMasterDTO master);
	
	public List<ExportMasterDTO> selectListExportMaster(
			Integer memId,
			String status,
			CriteriaDTO cri,
			String memRole
	);
	
	public ExportMasterDTO selectExportMaster(String exportId, String memRole);
	
	public int updateExportMasterStatus(String exportNumber, String status);
	
	public int updateExportMaster(ExportMasterDTO master);

	public ExportMasterDTO selectExportMasterByNumber(String exportNumber);
	
	public int updateOfficer(ExportMasterDTO master);
	
	public int updateDelayedYn();
}
