package kr.or.gtcs.log.importtaxpaymentlog.service;

import kr.or.gtcs.dto.ImportTaxPaymentDTO;

public interface ImportTaxPaymentLogService {
    void registerLog(ImportTaxPaymentDTO paymentDTO, String actionType);
}