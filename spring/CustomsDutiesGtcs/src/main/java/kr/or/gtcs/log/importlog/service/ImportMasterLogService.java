package kr.or.gtcs.log.importlog.service;

import kr.or.gtcs.dto.ImportMasterDTO;

public interface ImportMasterLogService {
	void registerLog(ImportMasterDTO master, String actionType);
}
