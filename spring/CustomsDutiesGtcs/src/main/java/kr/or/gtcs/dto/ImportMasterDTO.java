package kr.or.gtcs.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportMasterDTO {

    @Size(max = 50)
    private String importId; // 수입 신고서 고유 ID (MyBatis selectKey에서 시퀀스로 채움)

//    @NotNull(message = "작성자 ID는 필수입니다.")
    private Integer memId;

    private String status;

    @NotBlank(message = "수입자 상호는 필수입니다.")
    @Size(max = 50)
    private String importerName;

    @NotBlank(message = "성명(대표자)은 필수입니다.")
    @Size(max = 10)
    private String repName;

    @NotBlank(message = "전화번호는 필수입니다.")
    @Size(max = 14)
    private String telNo;

    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    @Size(max = 50)
    private String email;

    @NotBlank(message = "사업자등록번호는 필수입니다.")
    @Size(max = 10)
    private String bizRegNo;

    @NotBlank(message = "통관고유부호는 필수입니다.")
    @Size(max = 13)
    private String customsId;

    @NotBlank(message = "주소는 필수입니다.")
    @Size(max = 255)
    private String address;

    @NotBlank(message = "해외거래처는 필수입니다.")
    @Size(max = 50)
    private String overseasBizName;

    @NotBlank(message = "거래처 국적은 필수입니다.")
    @Size(max = 10)
    private String overseasCountry;

    @NotBlank(message = "수입종류는 필수입니다.")
    @Size(max = 20)
    private String importType;

    @NotBlank(message = "화물관리번호는 필수입니다.")
    @Size(max = 14)
    private String cargoMgmtNo;

    @NotBlank(message = "운송수단은 필수입니다.")
    @Size(max = 10)
    private String transMode;

    private String vesselName;
    private String vesselNation;

    @NotNull(message = "입항예정일은 필수입니다.")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate arrivalEstDate;

    @NotNull(message = "보세구역 반입일자는 필수입니다.")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate bondedInDate;

    private String originCountry; // Nullable
    private String arrivalPort;   // Nullable
    private String blNo;          // Nullable
    private String awbNo;         // Nullable

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate submitDate;

    @NotBlank(message = "통화 코드는 필수입니다.")
    @Size(max = 10)
    private String currencyCode;

    @NotNull(message = "결제금액은 필수입니다.")
    @PositiveOrZero
    private Double payAmount;

    @NotBlank(message = "인보이스 번호는 필수입니다.")
    @Size(max = 20)
    private String invoiceNo;

    @NotNull(message = "인보이스 발행일은 필수입니다.")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate invoiceDate;

    @NotBlank(message = "계약번호는 필수입니다.")
    @Size(max = 15)
    private String contractNo;

    @NotNull(message = "계약일자는 필수입니다.")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate contractDate;

    @NotBlank(message = "구매주문서번호는 필수입니다.")
    @Size(max = 15)
    private String poNo;

    @NotNull(message = "구매주문일은 필수입니다.")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate poDate;

    @NotBlank(message = "인도조건은 필수입니다.")
    @Size(max = 5)
    private String incoterms;

    @NotNull(message = "총중량은 필수입니다.")
    private Double totalWeight;

    private String originCertYn; // 원산지증명서유무 (Y, N)

    private String freightCurrency;
    private Double freightAmt;

    private String insuranceCurrency;
    private Double insuranceAmt;

    private String addAmtCurrency;
    private Double addAmt;

    @NotNull
    private Long totalTaxBase; // 총과세가격

    @NotNull
    private Long totalDuty; // 총관세

    @NotNull
    private Long totalVat; // 총부가세

    @NotNull
    private Long totalTaxSum; // 총세액합계

    @NotBlank(message = "컨테이너 번호는 필수입니다.")
    @Size(max = 40)
    private String contNo;

    @NotBlank(message = "HS코드는 필수입니다.")
    @Size(max = 12)
    private String hsCode;

    @NotBlank(message = "관세구분은 필수입니다.")
    @Size(max = 20)
    private String taxType;

    @NotBlank(message = "관세액 기준은 필수입니다.")
    @Size(max = 7)
    private String taxBaseType;

    @NotBlank(message = "신고품명은 필수입니다.")
    @Size(max = 50)
    private String itemNameDeclared;

    @NotBlank(message = "거래품명은 필수입니다.")
    @Size(max = 50)
    private String itemNameTrade;

    @NotBlank(message = "모델명은 필수입니다.")
    @Size(max = 150)
    private String modelName;

    @NotNull
    @PositiveOrZero
    private Double qty;

    @NotBlank(message = "단위는 필수입니다.")
    @Size(max = 10)
    private String qtyUnit;

    @NotNull
    @PositiveOrZero
    private Double unitPrice;

    @NotNull
    private Double totalAmount; // 금액

    @NotNull
    private Double netWeight; // 순중량

    @NotNull
    private Long taxBaseAmtItem; // 과세가격(란별)

    @NotBlank(message = "원산지 코드는 필수입니다.")
    @Size(max = 2)
    private String originCode;

    @NotBlank
    @Pattern(regexp = "[YN]")
    private String originMarkYn; // 원산지표시유무 (Y)
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate modDate;
    
    private String importNumber;

    private Integer totalCount;  // 전체 데이터 수
    private Integer totalPage;   // 전체 페이지 수
    private Integer rnum;
    
    
    private AiDocCheckDTO aiDocCheck;
    private List<AttachentsDTO> fileList;
    
    // 담당 세관원 ID (NUMBER)
    private Integer officerId;
    
    // 배정 일시 (DATE)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime assignDate;
    // 3일 지연 여부 (Y/N)
    private String delayYn;       

    private MemberDTO member;
    
    // 담당 세관원 정보 (추가)
    private MemberDTO officer;
    
    
}