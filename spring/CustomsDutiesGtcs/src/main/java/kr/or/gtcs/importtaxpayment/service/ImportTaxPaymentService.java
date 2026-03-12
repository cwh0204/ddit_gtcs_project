package kr.or.gtcs.importtaxpayment.service;

import kr.or.gtcs.dto.ImportTaxPaymentDTO;

public interface ImportTaxPaymentService {
	
    /**
     * 세금 고지서 자동 발행 (상태를 PAY_WAITING으로 전환)
     */
    public void generateTaxBill(String importId, String officerId);
    
    /**
     * 가상계좌 발급 정보 업데이트
     */
    public void issueVirtualAccount(String importId, String bankName, String virtualAcct);
    
    /**
     * 세금 납부 완료 처리 (상태를 PAY_COMPLETED로 전환)
     */
    public void processPayment(String importId, String payerName);
    
    /**
     * 세금 납부 정보 상세 단건 조회
     */
    public ImportTaxPaymentDTO getTaxPaymentInfo(String importId);
}