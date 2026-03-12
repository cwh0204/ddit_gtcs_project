package kr.or.gtcs.exportmaster.mapper;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import kr.or.gtcs.dto.ExportMasterDTO;
import lombok.extern.log4j.Log4j2;

@Log4j2
@SpringBootTest
class ExportMasterMapperTest2 {
	
	@Autowired
	ExportMasterMapper mapper;
	
	@Test
	void test() {
		ExportMasterDTO master = new ExportMasterDTO();
		master.setOfficerId(186);
		master.setExportId("122");
		
		mapper.updateOfficer(master);
//		log.info(mapper.selectExportMaster("109", "SHIPPER"));
	}

}
