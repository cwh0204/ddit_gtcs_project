package kr.or.gtcs.log.importlog.mapper;

import org.apache.ibatis.annotations.Mapper;

import kr.or.gtcs.dto.ImportMasterLogDTO;

@Mapper
public interface ImportMasterLogMapper {
	int insertImportMasterLog(ImportMasterLogDTO logDTO);
}
