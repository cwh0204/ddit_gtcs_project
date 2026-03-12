package kr.or.gtcs.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class WarehouseStockLogDTO extends WarehouseStockDTO {
	private Integer logId;      // 로그 PK
    private String actionType;  // 행동 유형
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate actionDate; // 행동 일자
    private Integer workerId;   // 작업자
	
}
