package kr.or.gtcs.exportmaster.service;

import java.util.List; // 리턴 타입이 List라고 가정

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import kr.or.gtcs.dto.CriteriaDTO;
import kr.or.gtcs.dto.ExportMasterDTO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootTest
class ExportMasterServiceImplTest {
	
	@Autowired
	ExportMasterService service;
	
	@Test
	@DisplayName("상세 조회 테스트 - OFFICER 권한 (AI 점수 확인용)")
	void testFindExportMaster() {
		// [입력값 설정] DB에 실제로 존재하는 exportId를 입력하세요.
		String exportId = "4"; 
		String userRole = "OFFICER"; // SHIPPER면 AI 정보가 null로 나옴, OFFICER로 테스트 추천
		
		ExportMasterDTO dto = service.findExportMaster(exportId, userRole);
		
		log.info(">>> 1. 전체 DTO 조회: " + dto);
		
		if (dto != null) {
			log.info(">>> 2. 신고번호: " + dto.getExportNumber());
			
			// AI 매핑 확인 (MyBatis Association 동작 확인)
			if (dto.getAiDocCheck() != null) {
				log.info(">>> [성공] AI 검사 객체 있음!");
				log.info(">>> 위험도 점수: " + dto.getAiDocCheck().getRiskScore());
				log.info(">>> 위험도 결과: " + dto.getAiDocCheck().getRiskResult());
				log.info(">>> 문서 점수: " + dto.getAiDocCheck().getDocScore());
			} else {
				log.info(">>> [참고] AI 검사 결과 없음 (권한이 SHIPPER거나, 아직 분석 전)");
			}
		}
	}
	
	@Test
	@DisplayName("목록 조회 테스트 - SHIPPER 권한 (페이징 확인)")
	void testFindAllExportMaster() {
		// [입력값 설정]
		int memId = 80;
		String status = "ALL";
		String userRole = "SHIPPER";
		
		// 페이징 기준 설정 (1페이지, 10개씩)
		CriteriaDTO cri = new CriteriaDTO();
		cri.setPageNum(1);
		cri.setAmount(10); 
		
		// 리턴 타입이 무엇인지에 따라(Map or List) 로그가 찍힙니다.
		Object result = service.findAllExportMaster(memId, status, cri, userRole);
		
		log.info(">>> 목록 조회 결과: " + result.toString());
	}

}