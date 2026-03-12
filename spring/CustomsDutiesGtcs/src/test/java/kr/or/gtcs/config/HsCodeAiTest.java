package kr.or.gtcs.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import kr.or.gtcs.util.AiDateEngine;
import lombok.extern.log4j.Log4j2;

@Log4j2
@SpringBootTest
class HsCodeAiTest {
	
	@Autowired
	AiDateEngine hscode;
	
	@Test
	void test() {
		
//		log.info(hscode.hsCondeCreate("hbm"));
		
	}

}
