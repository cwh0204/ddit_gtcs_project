package kr.or.gtcs.attachents.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
class AttachentsServiceImplTest {
	
	@Autowired
	AttachentsService service;
	
	@Test
	void test() {
		log.info(service.getFile("3"));
	}

}
