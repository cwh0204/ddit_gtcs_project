package kr.or.gtcs.log.exportlog.service;

import kr.or.gtcs.dto.ExportMasterDTO;

public interface ExportMasterLogService {
	void registerLog(ExportMasterDTO master, String actionType);
}
