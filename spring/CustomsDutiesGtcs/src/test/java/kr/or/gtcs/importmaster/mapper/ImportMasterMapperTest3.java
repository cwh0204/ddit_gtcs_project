package kr.or.gtcs.importmaster.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

import kr.or.gtcs.dto.ExportMasterDTO;
import kr.or.gtcs.dto.ImportMasterDTO;
import kr.or.gtcs.importmaster.service.ImportMasterService;
import lombok.extern.log4j.Log4j2;


@Log4j2
@SpringBootTest
class ImportMasterMapperTest3 {

	@Autowired
	private ImportMasterService service;
	
	@Test
	@Rollback(false)
	void test() {
		
		ImportMasterDTO master = service.findImportMaster("33", "OFFICER");
		
		log.info(master.toString());
		master.setImporterName("최상철컴퍼니123");


	}

}
