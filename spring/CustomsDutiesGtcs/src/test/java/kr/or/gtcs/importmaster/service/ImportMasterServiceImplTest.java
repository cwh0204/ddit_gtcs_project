package kr.or.gtcs.importmaster.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import kr.or.gtcs.dto.ImportMasterDTO;
import lombok.extern.log4j.Log4j2;

@Log4j2
@SpringBootTest
class ImportMasterServiceImplTest {
	
	@Autowired
	ImportMasterService service;
	
	@Test
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
				.importType("12")
				.cargoMgmtNo("12") // 14자리
				.transMode("12")               // 해상운송 등
				.vesselName("12-PIONEER")
				.vesselNation("12")
				.arrivalEstDate(java.time.LocalDate.now().plusDays(3))
				.bondedInDate(java.time.LocalDate.now())
				.originCountry("12")
				.arrivalPort("12")
				.blNo("12")
				
				// [3. 계약 및 결제 정보]
				.currencyCode("12")
				.payAmount(1500.50)
				.invoiceNo("12-12-001")
				.invoiceDate(java.time.LocalDate.now())
				.contractNo("12-2026-01")
				.contractDate(java.time.LocalDate.now())
				.poNo("12-2026-X1")
				.poDate(java.time.LocalDate.now())
				
				// [4. 무게 및 인도조건]
				.incoterms("12")
				.totalWeight(120.500)      // NUMBER(20,3)
				.originCertYn("Y")
				.freightCurrency("12")
				.freightAmt(100.00)
				.insuranceCurrency("12")
				.insuranceAmt(50.00)
				.addAmtCurrency("12")
				.addAmt(0.0)
				
				// [5. 세금 계산 (Long 타입)]
				.totalTaxBase(2100000L)
				.totalDuty(168000L)
				.totalVat(226800L)
				.totalTaxSum(394800L)
				
				// [6. 물품 상세 정보]
				.contNo("12")
				.hsCode("12")
				.taxType("A")             // 기본세율
				.taxBaseType("12")
				.itemNameDeclared("12 12")
				.itemNameTrade("12 12 12")
				.modelName("12")
				.qty(10.0)                // 수량
				.qtyUnit("12")            // 단위
				.unitPrice(1.00)        // 단가
				.totalAmount(1.00)     // 총금액
				.netWeight(1.000)       // 순중량
				.taxBaseAmtItem(2000000L) // 란별 과세가격
				.originCode("US")         // 원산지코드
				.originMarkYn("Y")        // 원산지표시유무
				.build();
		
//		service.registerImportMaster(master);
		
		log.info("생성된 더미 데이터: {}", master);
	}

}
