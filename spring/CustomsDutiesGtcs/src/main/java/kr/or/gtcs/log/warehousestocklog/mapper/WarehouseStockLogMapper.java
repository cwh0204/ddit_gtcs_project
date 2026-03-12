package kr.or.gtcs.log.warehousestocklog.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.gtcs.dto.WarehouseHistoryDTO;
import kr.or.gtcs.dto.WarehouseStockLogDTO;

@Mapper
public interface WarehouseStockLogMapper {
	public int insertStockLog(WarehouseStockLogDTO logDTO);

	List<WarehouseHistoryDTO> selectWarehouseLogListByDeclNo(String declNo);
	
}
