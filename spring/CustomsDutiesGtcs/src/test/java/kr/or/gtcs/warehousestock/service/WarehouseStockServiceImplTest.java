package kr.or.gtcs.warehousestock.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import kr.or.gtcs.dto.WarehouseStockDTO;

@SpringBootTest
class WarehouseStockServiceImplTest {
	
	@Autowired
	WarehouseStockService service;
	
	
	@Test
	void test() {
		WarehouseStockDTO stockDto = new WarehouseStockDTO();

		// 데이터 세팅
		stockDto.setUniqueNo("AWB12345678");        // AWB 또는 B/L 번호
		stockDto.setItemName("반도체 정밀 부품");      // 품명
		stockDto.setQty(500);                        // 수량
		stockDto.setGrossWeight(125);             // 중량 (10,2 format)
		stockDto.setWarehouseId("WH-A1");            // 창고 구역 ID
		stockDto.setPositionArea("BONDED");          // 보세구역 여부
		stockDto.setMemId(900);                     // 회원 식별자
		stockDto.setRepName("홍길동");                // 대표자명
		
		//service.registerWarehouseStock(stockDto);
	}

}
