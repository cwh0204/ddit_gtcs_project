package kr.or.gtcs.dto;

import java.time.LocalDate;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class ImportTaxPaymentLogDTO extends ImportTaxPaymentDTO {

    private Integer logId;       // 로그 시퀀스
    private String actionType;   // 행동 유형
    private LocalDate actionDate;
    private Long workerId;    // 작업자 (memId와 타입 맞춤)
}