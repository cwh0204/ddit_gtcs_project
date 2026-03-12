package kr.or.gtcs.importmaster.mapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import kr.or.gtcs.dto.AiDocCheckDTO;
import kr.or.gtcs.dto.ImportMasterDTO;
import kr.or.gtcs.importmaster.service.ImportMasterService;
import kr.or.gtcs.util.AiDateEngine;
import lombok.extern.log4j.Log4j2;

@Log4j2
@SpringBootTest
class ImportMasterMapperTest {
	
	@Autowired
	ImportMasterMapper mapper;
	
	@Autowired
	AiDateEngine aiEngine;
	
	@Test
	@Transactional
//    @Rollback(false)
	void test() {
		System.out.println("### 테스트 시작됨!!! ###");
		ImportMasterDTO master = ImportMasterDTO.builder()
				.memId(80)                // 실제 DB에 존재하는 회원번호(FK)
				.status("SAVE")           // 초기 상태
				
				// [1. 수입자 정보]
				.importerName("(주)대전에이아이")
				.repName("이성인")         // 사용자님 성함이나 관리자명
				.telNo("042-123-4567")
				.email("test@gtcs.or.kr")
				.bizRegNo("1234567890")
				.customsId("P123456789012") // 통관고유부호 (P+12자리)
				.address("대전광역시 중구 중앙로 121")
				.overseasBizName("Global Tech Solutions")
				.overseasCountry("US")
				
				// [2. 물류 및 운송 정보]
				.importType("일반수입")
				.cargoMgmtNo("24GTCS12345678") // 14자리
				.transMode("10")               // 해상운송 등
				.vesselName("GTCS-PIONEER")
				.vesselNation("KOREA")
				.arrivalEstDate(java.time.LocalDate.now().plusDays(3))
				.bondedInDate(java.time.LocalDate.now())
				.originCountry("US")
				.arrivalPort("BUSAN")
				.blNo("BL1234567890")
				
				// [3. 계약 및 결제 정보]
				.currencyCode("USD")
				.payAmount(1500.50)
				.invoiceNo("INV-2026-001")
				.invoiceDate(java.time.LocalDate.now())
				.contractNo("CONT-2026-01")
				.contractDate(java.time.LocalDate.now())
				.poNo("PO-2026-X1")
				.poDate(java.time.LocalDate.now())
				
				// [4. 무게 및 인도조건]
				.incoterms("CIF")
				.totalWeight(120.500)      // NUMBER(20,3)
				.originCertYn("Y")
				.freightCurrency("USD")
				.freightAmt(100.00)
				.insuranceCurrency("USD")
				.insuranceAmt(50.00)
				.addAmtCurrency("KRW")
				.addAmt(0.0)
				
				// [5. 세금 계산 (Long 타입)]
				.totalTaxBase(2100000L)
				.totalDuty(168000L)
				.totalVat(226800L)
				.totalTaxSum(394800L)
				
				// [6. 물품 상세 정보]
				.contNo("CONT1234567")
				.hsCode("8504.40.1000")
				.taxType("A")             // 기본세율
				.taxBaseType("FOB")
				.itemNameDeclared("Computer Monitor")
				.itemNameTrade("OLED Monitor 27inch")
				.modelName("LG-OLED-27")
				.qty(10.0)                // 수량
				.qtyUnit("EA")            // 단위
				.unitPrice(150.00)        // 단가
				.totalAmount(1500.00)     // 총금액
				.netWeight(110.000)       // 순중량
				.taxBaseAmtItem(2000000L) // 란별 과세가격
				.originCode("US")         // 원산지코드
				.originMarkYn("Y")        // 원산지표시유무
				.build();
		
		log.info("생성된 더미 데이터: {}", master);
		
		String aiResult = aiEngine.aiDocAnalyzer(master);
		
		log.info("문서번호 : {}", aiResult);
	
	}

}
