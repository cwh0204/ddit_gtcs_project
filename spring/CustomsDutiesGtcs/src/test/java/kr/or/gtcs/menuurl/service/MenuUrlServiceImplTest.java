package kr.or.gtcs.menuurl.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import kr.or.gtcs.menuurl.mapper.MenuUrlMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootTest
class MenuUrlServiceImplTest {
	
	@Autowired
	MenuUrlMapper mapper;
	
	@Autowired
	private MenuUrlService service;
	
	@Test
	void test() {
		log.info(mapper.existsByUrl("").toString());
	}

}
