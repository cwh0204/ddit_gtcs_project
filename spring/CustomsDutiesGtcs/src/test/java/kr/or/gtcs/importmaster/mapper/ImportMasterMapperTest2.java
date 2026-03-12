package kr.or.gtcs.importmaster.mapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import kr.or.gtcs.dto.CriteriaDTO;
import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
class ImportMasterMapperTest2 {

	@Autowired
	ImportMasterMapper mapper;
	
	@Test
	void test() {
		CriteriaDTO cri = new CriteriaDTO();
		cri.setAmount(1);
//		log.info(mapper.selectListImportMaster(80, "ALL", cri).toString());
	}

}
