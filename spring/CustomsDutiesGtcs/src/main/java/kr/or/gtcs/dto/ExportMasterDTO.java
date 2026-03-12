package kr.or.gtcs.dto;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExportMasterDTO {
	
	private String exportId;
	private Integer memId;
	private String exporterName;
	private String repName;
	private String bizRegNo;
	private String buyerIdNo;
	private String customsId;
	private String buyerName;
	private String buyerAddress;
	private String destCountry;
	private String loadingPort;
	private String goodsLoc;
	private Integer exchangeRate;
	private String currencyCode;
	private Integer payAmount;
	private Integer freightAmt;
	private Integer insuranceAmt;
	private String cargoMgmtNo;
	private String bondedRepName;
	private String carrierName;
	private String vesselName;
	private String loadingLoc;
	private String contNo;
	private String hsCode;
	private String itemNameDeclared;
	private String itemNameTrade;
	private String brandName;
	private Integer totalWeight;
	private Integer totalPackCnt;
	private Integer qty;
	private String qtyUnit;
	private String invoiceNo;
	private String originCountry;
	private String modelName;
	private Integer unitPrice;
	private Integer totalDeclAmt;
	private String status;
	private String exportNumber;
	private String dclType;
	private String transMode;
	private String exportKind;
	private String paymentMethod;
	private String incoterms;
	private String transportMode;
	private String containerMode;
	private String goodsType;
	private String refundApplicant;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
	private LocalDate regDate;
	private String invoiceSign;
	private String attachYn;
	private String originCriteria;
	private String originMarkYn;
	private String originCertType;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
	private LocalDate submitDate;
	private Integer officerId;
	private LocalDate assignDate;
    
    private AiDocCheckDTO aiDocCheck;
    private List<AttachentsDTO> fileList;
    private MemberDTO member;
    private int rnum;
    private int totalCount;
    private int totalPage;
    private String delayYn;
}