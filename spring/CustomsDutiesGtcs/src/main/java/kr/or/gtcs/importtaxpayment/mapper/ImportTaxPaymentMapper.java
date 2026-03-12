package kr.or.gtcs.importtaxpayment.mapper;

import org.apache.ibatis.annotations.Mapper;
import kr.or.gtcs.dto.ImportTaxPaymentDTO;

@Mapper
public interface ImportTaxPaymentMapper {

    // 고지서 초기 생성 (XML id="insertImportTaxPayment")
    public int insertImportTaxPayment(ImportTaxPaymentDTO taxBill);

    // 가상계좌 발급 업데이트 (XML id="updateVirtualAccount")
    public int updateVirtualAccount(ImportTaxPaymentDTO taxBill);

    // 납부 처리 및 입금자명 업데이트 (XML id="updatePayerAndStatus")
    public int updatePayerAndStatus(ImportTaxPaymentDTO taxBill);

    // 고지서 조회 (XML id="selectTaxPaymentByImportId")
    public ImportTaxPaymentDTO selectTaxPaymentByImportId(String importId);

}