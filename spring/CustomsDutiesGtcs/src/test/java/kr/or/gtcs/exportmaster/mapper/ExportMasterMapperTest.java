package kr.or.gtcs.exportmaster.mapper;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import kr.or.gtcs.dto.ExportMasterDTO;
import lombok.extern.log4j.Log4j2;

@Log4j2
@SpringBootTest
class ExportMasterMapperTest {
	
	@Autowired
	ExportMasterMapper mapper;
	
	@Test
	void testInsert() {
		
		ExportMasterDTO dto = ExportMasterDTO.builder()
			// 1. 기본 정보
			.memId(80)            // Integer
			.status("SAVE")       // String
			
			// 2. 수출자/구매자 정보
			.exporterName("(주)글로벌트레이딩")
			.repName("이순신")
			.bizRegNo("123-45-67890")
			.customsId("ABC12345678")
			.buyerIdNo("BUYER-US-99")
			.buyerName("TECH WORLD INC.")
			.buyerAddress("Washington, DC")
			.destCountry("US")
			
			// 3. 물류 정보
			.loadingPort("KRPUS")
			.goodsLoc("서울 금천구")
			.cargoMgmtNo("04012345678901234")
			.bondedRepName("관세법인 에이전트")
			.carrierName("HMM")
			.vesselName("SKY-HOPE 001")
			.loadingLoc("BONDED_01")
			.contNo("CONT9876543")
			
			// 4. 금액 및 환율 [DTO 타입: Double vs Integer 주의!]
			.exchangeRate(1350)   // Double (환율은 소수점 필요)
			.currencyCode("USD")
			
			// [주의] DTO에서 Integer로 선언했으므로 L이나 .0을 붙이면 안됨
			.payAmount(50000)        // Integer
			.totalDeclAmt(67525000)  // Integer (약 6,700만)
			.freightAmt(1200)        // Integer
			.insuranceAmt(300)       // Integer
			
			// 5. 수량 및 중량
			.totalWeight(120)      // Double
			.totalPackCnt(25)        // Integer
			.qty(500)                // Integer (수량도 정수로 설정됨)
			.qtyUnit("PCE")
			.unitPrice(100)        // Double (단가는 소수점 가능)
			
			// 6. 물품 정보 (DTO 필드명 일치 확인 완료)
			.hsCode("8517130000")
			.itemNameDeclared("스마트폰용 부품")   // itemNameDeclared
			.itemNameTrade("Mobile Display Panel") // itemNameTrade
			.brandName("SAMSUNG")
			.modelName("SM-G998N")
			
			// 7. 기타 코드
			.invoiceNo("INV-2026-0206")
			.originCountry("KR")
			.dclType("1")
			.transMode("11")
			.exportKind("10")
			.paymentMethod("TT")
			.incoterms("FOB")
			.transportMode("10")
			.containerMode("1")
			.goodsType("N")
			.refundApplicant("1")
			.build();
		
		log.info(">>> INSERT 시도 데이터: " + dto);
		
		int result = mapper.insertExportMaster(dto);
		
		log.info(">>> INSERT 결과 (1이면 성공): " + result);
		log.info(">>> 발급된 수출신고번호: " + dto.getExportNumber());
	}

}