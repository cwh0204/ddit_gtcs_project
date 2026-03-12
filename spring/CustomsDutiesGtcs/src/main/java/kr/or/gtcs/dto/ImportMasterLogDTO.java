package kr.or.gtcs.dto;

import java.time.LocalDate;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class ImportMasterLogDTO extends ImportMasterDTO {

    private Integer logId;       // 시퀀스 PK
    private String actionType;   // REGISTER, MODIFY 등
    private LocalDate actionDate;
    private Integer workerId;    // 작업자
    
}