package kr.or.gtcs.warehousestock.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.gtcs.dto.AttachentsDTO;
import kr.or.gtcs.dto.ExportMasterDTO;
import kr.or.gtcs.dto.ImportMasterDTO;
import kr.or.gtcs.dto.MemberDTO;
import kr.or.gtcs.dto.WarehouseHistoryDTO;
import kr.or.gtcs.dto.WarehouseStockAreaDTO;
import kr.or.gtcs.dto.WarehouseStockDTO;

@Mapper
public interface WarehouseStockMapper {
	
	public int insertWarehouseStock(WarehouseStockDTO stock);
	
	public WarehouseStockDTO selectLocateWarehouseStock(WarehouseStockDTO stock);
	
	public WarehouseStockDTO selectDetailWarehouseStock(Integer stockNo);
	
	public List<WarehouseStockDTO> selectListWarehouseStock(MemberDTO member);
	
	public int updateLocateWarehouseStock(WarehouseStockDTO stock);
	
	public int updateOutboundWarehouseStock(WarehouseStockDTO stock);
	
	public int updateWarehouseStock(WarehouseStockDTO stock);
	
	public ImportMasterDTO selectImportByNo(String declNo);
	
    public ExportMasterDTO selectExportByNo(String declNo);
    
    public List<AttachentsDTO> selectFilesByNo(String declNo);
    
    public List<WarehouseStockAreaDTO> selectWarehouseStockAreaCount(String positionArea);
    
    public List<WarehouseHistoryDTO> selectWarehouseLogListByDeclNo(String declNo);

}
