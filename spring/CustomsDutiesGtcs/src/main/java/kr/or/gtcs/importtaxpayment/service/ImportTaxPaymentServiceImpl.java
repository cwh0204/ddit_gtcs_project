package kr.or.gtcs.importtaxpayment.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.gtcs.commons.exception.SystemFailureException;
import kr.or.gtcs.dto.ImportMasterDTO;
import kr.or.gtcs.dto.ImportTaxPaymentDTO;
import kr.or.gtcs.importmaster.mapper.ImportMasterMapper;
import kr.or.gtcs.importtaxpayment.mapper.ImportTaxPaymentMapper;
import kr.or.gtcs.log.importlog.service.ImportMasterLogService;
import kr.or.gtcs.log.importtaxpaymentlog.service.ImportTaxPaymentLogService;
import kr.or.gtcs.security.auth.MemberDTOWrapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ImportTaxPaymentServiceImpl implements ImportTaxPaymentService {

    private final ImportMasterMapper masterMapper;
    private final ImportTaxPaymentMapper taxMapper;
    private final ImportTaxPaymentLogService taxLog;
    private final ImportMasterLogService importLog;

    /**
     * 고지서 발행 (PAY_WAITING 상태로 전환 및 관련 로그 기록)
     * @param importId 수입 신고서 고유 ID
     * @param officerId 담당 세관원 ID
     * @throws SystemFailureException 신고서 조회 실패 또는 고지서 발행 중 오류 시
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void generateTaxBill(String importId, String officerId) {
        try {
            ImportMasterDTO master = masterMapper.selectImportMaster(importId, "OFFICER");

            if (master == null) {
                throw new SystemFailureException("존재하지 않는 수입신고 ID입니다: " + importId);
            }

            ImportTaxPaymentDTO taxBill = ImportTaxPaymentDTO.builder()
                    .importId(master.getImportId())      
                    .totalAmount(master.getTotalTaxSum())
                    .taxBase(master.getTotalTaxBase())
                    .dutyAmt(master.getTotalDuty())
                    .vatAmt(master.getTotalVat())
                    .bizRegNo(master.getBizRegNo())      
                    .payStatus("PAY_WAITING")            
                    .remarks("수입신고 수리 시스템 자동 발행")
                    .build();

            if (master.getMemId() != null) taxBill.setMemId(master.getMemId().longValue());
            
            if (officerId != null && !officerId.isEmpty()) {
                taxBill.setOfficerId(Long.parseLong(officerId));
            } else {
                Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                if (principal instanceof MemberDTOWrapper) {
                    taxBill.setOfficerId(((MemberDTOWrapper) principal).getRealUser().getMemId().longValue());
                }
            }

            int result = taxMapper.insertImportTaxPayment(taxBill);
            
            if (result > 0) {
                masterMapper.updateImportMasterStatus(master.getImportNumber(), "PAY_WAITING");
                taxLog.registerLog(taxBill, "BILL_GEN");
                master.setStatus("PAY_WAITING");
                importLog.registerLog(master, "PAY_WAITING");
            }
        } catch (SystemFailureException e) {
            throw e;
        } catch (Exception e) {
            throw new SystemFailureException("세금 고지서 발행 중 시스템 오류가 발생했습니다.");
        }
    }
    
    /**
     * 가상계좌 발급 처리
     * @param importId 수입 신고서 고유 ID
     * @param bankName 발급받은 은행명
     * @param virtualAcct 발급된 가상계좌번호
     * @throws SystemFailureException 가상계좌 발급 업데이트 중 오류 시
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void issueVirtualAccount(String importId, String bankName, String virtualAcct) {
        try {
            ImportTaxPaymentDTO params = ImportTaxPaymentDTO.builder()
                    .importId(importId)
                    .bankName(bankName)       
                    .virtualAcct(virtualAcct) 
                    .build();

            int result = taxMapper.updateVirtualAccount(params);

            if (result > 0) {
                ImportTaxPaymentDTO updatedBill = taxMapper.selectTaxPaymentByImportId(importId);
                taxLog.registerLog(updatedBill, "VACCT_ISSUE");
            }
        } catch (Exception e) {
            throw new SystemFailureException("가상계좌 발급 중 시스템 오류가 발생했습니다.");
        }
    }
    
    /**
     * 납부 완료 처리 (PAY_COMPLETED 상태로 전환 및 관련 로그 기록)
     * @param importId 수입 신고서 고유 ID
     * @param payerName 입금자명
     * @throws SystemFailureException 납부 완료 업데이트 중 오류 시
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void processPayment(String importId, String payerName) {
        try {
            ImportTaxPaymentDTO params = ImportTaxPaymentDTO.builder()
                    .importId(importId)
                    .payerName(payerName)
                    .build();
                    
            int result = taxMapper.updatePayerAndStatus(params);
            
            if (result > 0) {
                ImportMasterDTO master = masterMapper.selectImportMaster(importId, "OFFICER");
                masterMapper.updateImportMasterStatus(master.getImportNumber(), "PAY_COMPLETED");
                
                ImportTaxPaymentDTO completedBill = taxMapper.selectTaxPaymentByImportId(importId);
                taxLog.registerLog(completedBill, "PAY_COMP");

                master.setStatus("PAY_COMPLETED");
                importLog.registerLog(master, "PAY_COMPLETED");
            }
        } catch (Exception e) {
            throw new SystemFailureException("납부 처리 중 시스템 오류가 발생했습니다.");
        }
    }
    
    /**
     * 납부 상세 정보 단건 조회
     * @param importId 수입 신고서 고유 ID
     * @return 납부 상세 정보 DTO
     * @throws SystemFailureException 조회 중 오류 시
     */
    @Override
    public ImportTaxPaymentDTO getTaxPaymentInfo(String importId) {
        try {
            return taxMapper.selectTaxPaymentByImportId(importId);
        } catch (Exception e) {
            throw new SystemFailureException("납부 정보 조회 중 시스템 오류가 발생했습니다.");
        }
    }
}