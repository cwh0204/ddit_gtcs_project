package kr.or.gtcs.log.exportlog.mapper;

import org.apache.ibatis.annotations.Mapper;
import kr.or.gtcs.dto.ExportMasterLogDTO;

@Mapper
public interface ExportMasterLogMapper {
    int insertExportMasterLog(ExportMasterLogDTO logDTO);
}