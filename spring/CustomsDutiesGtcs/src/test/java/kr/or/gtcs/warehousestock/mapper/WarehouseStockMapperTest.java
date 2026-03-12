package kr.or.gtcs.warehousestock.mapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import kr.or.gtcs.dto.WarehouseStockDTO;
import lombok.extern.log4j.Log4j2;

@Log4j2
@SpringBootTest
class WarehouseStockMapperTest {
	
	@Autowired
	WarehouseStockMapper mapper;
	
	@Test
	void test() {
		WarehouseStockDTO dto = new WarehouseStockDTO();
		dto.setUniqueNo("ABC-1234"); // AWB, B/L번호
		dto.setItemName("최상철까까"); // 품명
		dto.setQty(11); // 수량
		dto.setGrossWeight(30000); // 중량
		dto.setWarehouseId("A-B-C-12"); // 적재구역
		dto.setPositionArea("BONDED"); // 보세 국내 구분
		dto.setMemId(80); // 담당자 Id
		
		mapper.insertWarehouseStock(dto);
	}
	
	@Test
	void test1() {
		WarehouseStockDTO dto = new WarehouseStockDTO();
		dto.setStockId(2);
		
		log.info(mapper.selectDetailWarehouseStock(2));
	}

}
