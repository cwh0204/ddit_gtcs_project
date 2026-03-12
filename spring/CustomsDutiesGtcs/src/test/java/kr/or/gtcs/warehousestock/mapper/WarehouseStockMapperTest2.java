package kr.or.gtcs.warehousestock.mapper;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import kr.or.gtcs.dto.WarehouseStockAreaDTO;
import kr.or.gtcs.dto.WarehouseStockDTO;
import lombok.extern.slf4j.Slf4j;
import lombok.extern.slf4j.XSlf4j;

@Slf4j
@SpringBootTest
class WarehouseStockMapperTest2 {
	
	@Autowired
	private WarehouseStockMapper mapper;
	@Test
	void test() {
		WarehouseStockDTO dto = new WarehouseStockDTO();
		dto.setPositionArea("BONDED");
//		log.info(mapper.selectWarehouseStockAreaCount(dto).toString());
//		mapper.selectWarehouseStockAreaCount(dto);
	}

}
