package kr.or.gtcs.member.mapper;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import kr.or.gtcs.dto.MemberDTO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootTest
class MemberMapperTest {
	
	@Autowired
	MemberMapper mapper;
	
	@Test
	void test() {
		MemberDTO dto = new MemberDTO();
		dto.setMemId(180);
		mapper.deleteMember(dto);
	}

}
