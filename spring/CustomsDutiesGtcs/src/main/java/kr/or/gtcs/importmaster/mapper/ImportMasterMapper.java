package kr.or.gtcs.importmaster.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.or.gtcs.dto.CriteriaDTO;
import kr.or.gtcs.dto.ImportMasterDTO;

@Mapper
public interface ImportMasterMapper {
	public int insertImportMaster(ImportMasterDTO master);
	
	public List<ImportMasterDTO> selectListImportMaster(
		    Integer memId,
		    String status,
		    CriteriaDTO cri,
		    String memRole
		);
	
	public ImportMasterDTO selectImportMaster(String importId, String memRole);
	
	public int updateImportMasterStatus (String importNumber, String status);
	
	public int updateImportMaster(ImportMasterDTO master);
	
	public String selectImportIdByNumber(String importNumber);
	
	public ImportMasterDTO selectImportMasterImportId(String importId);
	
	// 가장 일이 적은 세관원 ID 찾기 (자동배정용)
    public Integer selectLeastBusyOfficer();
    
    // 자동 배정 처리 (세관원ID, 배정일시 업데이트)
    public int updateAutoAssign(String importNumber, Integer officerId);
    
    // 3일 지난 문서 DELAY_YN = 'Y'로 업데이트 (스케줄러용)
    public int updateDelayedYn();
    
    //수동 배정
    int updateManualAssign(ImportMasterDTO masterDTO);
    
    //세관원 목록 및 업무량 조회 (수동 배정용)
    List<Map<String, Object>> selectOfficerWorkloadList();
    
    // 상태별 건수 조회 (담당자 배정 페이지 탭 카운트용)
    List<Map<String, Object>> selectStatusCountList(Integer memId, String memRole);
    
}
