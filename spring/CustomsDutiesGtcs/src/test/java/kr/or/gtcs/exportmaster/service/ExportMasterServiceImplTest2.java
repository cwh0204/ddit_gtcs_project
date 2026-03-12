package kr.or.gtcs.exportmaster.service;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import kr.or.gtcs.dto.CriteriaDTO;
import kr.or.gtcs.dto.ExportMasterDTO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootTest
class ExportMasterServiceImplTest2 {
	
	@Autowired
	ExportMasterService service;
	
	@Test
	@DisplayName("목록 조회 테스트 (페이징 + 검색어 + 날짜)")
	void testFindAllExportMaster() {
		// 1. 기본 파라미터
		int memId = 80;
		String status = "ALL"; 
		String userRole = "SHIPPER"; // 또는 OFFICER
		
		// 2. CriteriaDTO 세팅 (페이징 & 검색)
		CriteriaDTO cri = new CriteriaDTO();
		
		// [페이징] 1페이지, 10개씩 보기
		cri.setPageNum(1);
		cri.setAmount(10);
		
		// [검색 옵션 1] 키워드 검색 (품명에 '스마트'가 들어간 것)
		 cri.setType("itemNameDeclared"); 
		 cri.setKeyword("스마트"); 
		
		// [검색 옵션 2] 날짜 검색 (2025-01-01 ~ 2026-12-31)
		 cri.setStartDate("2025-01-01");
		 cri.setEndDate("2026-12-31");
		
		log.info(">>> 조회 조건: " + cri); // startRow, endRow가 자동 계산되어 찍힘
		
		// 3. 서비스 호출
		List<ExportMasterDTO> list = service.findAllExportMaster(memId, status, cri, userRole);
		
		log.info(">>> 조회된 데이터 개수: " + list.size());
		
		if (list.size() > 0) {
			for (ExportMasterDTO item : list) {
				log.info("--------------------------------------------------");
				log.info("번호: " + item.getExportNumber());
				log.info("품명: " + item.getItemNameDeclared());
				log.info("날짜: " + item.getSubmitDate());
                // DTO에 totalPage 필드가 있다면 확인 가능
				log.info("전체 페이지 수: " + item.getTotalPage()); 
			}
		} else {
			log.info(">>> 조건에 맞는 데이터가 없습니다.");
		}
	}
}