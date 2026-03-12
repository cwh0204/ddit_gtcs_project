package kr.or.gtcs.log.importtaxpaymentlog.service;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.gtcs.dto.ImportTaxPaymentDTO;
import kr.or.gtcs.dto.ImportTaxPaymentLogDTO;
import kr.or.gtcs.log.importtaxpaymentlog.mapper.ImportTaxPaymentLogMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ImportTaxPaymentLogServiceImpl implements ImportTaxPaymentLogService {
	private final ImportTaxPaymentLogMapper logMapper;

	@Override
    @Transactional
    public void registerLog(ImportTaxPaymentDTO paymentDTO, String actionType) {
        
        ImportTaxPaymentLogDTO logDTO = new ImportTaxPaymentLogDTO();
        
        BeanUtils.copyProperties(paymentDTO, logDTO);
        
        logDTO.setActionType(actionType);
        
        logDTO.setWorkerId(paymentDTO.getOfficerId());
        
        logDTO.setMemId(paymentDTO.getMemId());
        
        logMapper.insertTaxPaymentLog(logDTO);
    }
}
	

