package kr.or.gtcs.importtaxpayment.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.gtcs.dto.ImportTaxPaymentDTO;
import kr.or.gtcs.importtaxpayment.service.ImportTaxPaymentService;
import kr.or.gtcs.commons.exception.SystemFailureException;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/rest/tax") 
@RequiredArgsConstructor
public class ImportTaxPaymentController {

    private final ImportTaxPaymentService taxService;
    
    /**
     * 납부 정보(가상계좌, 은행명, 납부상태 등) 단건 조회
     * @param importId 수입 신고서 고유 ID
     * @return 세금 납부 관련 상세 정보 DTO
     * @throws SystemFailureException DB 조회 실패 시 발생
     */
    @GetMapping("/info")
    public ImportTaxPaymentDTO getTaxPaymentInfo(@RequestParam("importId") String importId) {
        return taxService.getTaxPaymentInfo(importId);
    }
    
    /**
     * 고지서 생성 (수리 버튼 클릭 직후 자동 실행)
     * @param importId 수입 신고서 고유 ID
     * @param officerId 담당 세관원 ID (선택)
     * @throws SystemFailureException 고지서 생성 및 DB 처리 중 오류 발생 시
     */
    @PostMapping("/generate")
    public void generateTaxBill(
            @RequestParam("importId") String importId,
            @RequestParam(value = "officerId", required = false) String officerId
    ) {
        taxService.generateTaxBill(importId, officerId);
    }
    
    /**
     * 가상계좌 발급 처리 (상세 화면에서 '가상계좌 발급' 버튼)
     * @param params 발급받은 은행명, 가상계좌번호 등이 담긴 DTO
     * @throws SystemFailureException 계좌 업데이트 및 로깅 실패 시 발생
     */
    @PostMapping("/virtual-account")
    public void issueVirtualAccount(@RequestBody ImportTaxPaymentDTO params) {
        taxService.issueVirtualAccount(
            params.getImportId(), 
            params.getBankName(), 
            params.getVirtualAcct()
        );
    }
    
    /**
     * 납부 완료 처리 (상세 화면에서 '납부' 버튼)
     * @param params 입금자명 등이 담긴 DTO
     * @throws SystemFailureException 상태 업데이트 및 로깅 실패 시 발생
     */
    @PostMapping("/pay")
    public void processPayment(@RequestBody ImportTaxPaymentDTO params) {
        taxService.processPayment(
            params.getImportId(), 
            params.getPayerName()
        );
    }
}