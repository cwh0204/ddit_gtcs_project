package kr.or.gtcs.log.importtaxpaymentlog.mapper;

import org.apache.ibatis.annotations.Mapper;

import kr.or.gtcs.dto.ImportTaxPaymentLogDTO;

@Mapper
public interface ImportTaxPaymentLogMapper {
    int insertTaxPaymentLog(ImportTaxPaymentLogDTO logDTO);
}