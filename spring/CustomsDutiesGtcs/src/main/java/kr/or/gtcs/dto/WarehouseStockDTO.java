package kr.or.gtcs.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseStockDTO {
	
	private Integer stockId;
	private String uniqueNo;
	private String itemName;
	private Integer qty;
	private Integer grossWeight;
	private LocalDate entryDate;
	private String warehouseId;
	private String delYn;
	private String contNo;
	private String positionArea;
	private String declNo;
	private Integer memId;
	private LocalDate outDate;
	private String repName;
	private String damagedYn;
	private String damagedComment;
	private String regDate;
	
	private ExportMasterDTO exportMaster;
	private ImportMasterDTO importMaster;
	private List<AttachentsDTO> fileList;
}
