package kr.or.gtcs.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportTaxPaymentDTO {

    private Long payId;           // 납부 고유 번호 (PK)
    private String importId;      // 수입신고건 ID (FK, VARCHAR2(50))
    private Long memId;           // 납부 의무자 회원 ID (FK)
    private Long officerId;       // 처리한 세관원 ID
    private String payStatus;     // 납부 상태 (PAY_WAITING, PAY_COMPLETED)
    private Long totalAmount;     // 총 납부할 세액 합계
    private Long taxBase;         // 과세표준액
    private Long dutyAmt;         // 관세액
    private Long vatAmt;          // 부가세액
    
    // 고지서 발행일 (기본값: 현재날짜)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate issueDate;        
    
    // 납부 기한 (예: 2026-02-25) - 시간 불필요
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate dueDate;          
    
    // 실제 수납 일시 (예: 2026-02-12 14:30:00)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime paidDate;    
    private String bankName;      // 납부 은행명
    private String virtualAcct;   // 가상계좌 번호
    private String payerName;     // 실제 입금자명
    private String bizRegNo;      // 사업자등록번호
    private String delYn;         // 삭제 여부 (Y/N)
    private String remarks;       // 비고

    private Integer totalCount;   // 전체 데이터 수
    private Integer totalPage;    // 전체 페이지 수
    private int pageNum;          // 현재 페이지
}