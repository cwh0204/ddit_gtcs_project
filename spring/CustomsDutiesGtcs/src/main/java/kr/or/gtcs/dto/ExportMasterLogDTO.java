package kr.or.gtcs.dto;

import java.time.LocalDate;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class ExportMasterLogDTO extends ExportMasterDTO {

	private Integer logId;
	private String actionType;
	private LocalDate actionDate;
	private Integer workerId;
	
}
