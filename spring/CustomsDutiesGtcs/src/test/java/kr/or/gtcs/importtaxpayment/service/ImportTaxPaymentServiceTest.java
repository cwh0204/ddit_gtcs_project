//package kr.or.gtcs.importtaxpayment.service;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.eq;
//import static org.mockito.Mockito.times;
//import static org.mockito.Mockito.verify;
//import static org.mockito.Mockito.when;
//
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//
//import kr.or.gtcs.dto.ImportMasterDTO;
//import kr.or.gtcs.dto.ImportTaxPaymentDTO;
//import kr.or.gtcs.importmaster.mapper.ImportMasterMapper;
//import kr.or.gtcs.importtaxpayment.mapper.ImportTaxPaymentMapper;
//import kr.or.gtcs.log.importtaxpaymentlog.service.ImportTaxPaymentLogService;
//
//@ExtendWith(MockitoExtension.class)
//class ImportTaxPaymentServiceTest {
//
//    @InjectMocks
//    private ImportTaxPaymentServiceImpl taxService; // 테스트 대상
//
//    @Mock
//    private ImportMasterMapper masterMapper;      // 가짜 매퍼 1
//
//    @Mock
//    private ImportTaxPaymentMapper taxMapper;     // 가짜 매퍼 2
//
//    @Mock
//    private ImportTaxPaymentLogService logService; // 가짜 로그 서비스 (검증 핵심)
//
//    @Test
//    @DisplayName("세금 납부 전체 프로세스 (발행 -> 가상계좌 -> 납부완료) 및 로그 검증")
//    void testTaxPaymentLifecycle() {
//        // ==========================================
//        // [준비] 공통 데이터 세팅
//        // ==========================================
//        String importId = "60";
//        String importNumber = "IMP-20260214-000060";
//        String officerId = "999"; // 세관원 ID
//
//        // Mock용 수입신고서 원본 데이터
//        ImportMasterDTO mockMaster = ImportMasterDTO.builder()
//                .importId(importId)
//                .importNumber(importNumber)
//                .totalTaxSum(100000L) // 세액 10만원
//                .totalTaxBase(1000000L)
//                .totalDuty(80000L)
//                .totalVat(20000L)
//                .bizRegNo("123-45-67890")
//                .memId(80)
//                .build();
//
//        // ------------------------------------------------------------------
//        // [STEP 1] 고지서 발행 (BILL_GEN) 테스트
//        // ------------------------------------------------------------------
//        
//        // 1. Mock 동작 정의 (Stubbing)
//        when(masterMapper.selectImportMaster(importId, "OFFICER")).thenReturn(mockMaster);
//        when(taxMapper.insertImportTaxPayment(any(ImportTaxPaymentDTO.class))).thenReturn(1); // insert 성공 가정
//
//        // 2. 서비스 실행
//        int resultGen = taxService.generateTaxBill(importId, officerId);
//
//        // 3. 검증 (Assert & Verify)
//        assertEquals(1, resultGen, "고지서 발행 결과는 1이어야 함");
//        
//        // [핵심] BILL_GEN 로그가 찍혔는지 확인
//        verify(logService, times(1)).registerLog(any(ImportTaxPaymentDTO.class), eq("BILL_GEN"));
//        System.out.println("✅ STEP 1: 고지서 발행 및 로그(BILL_GEN) 검증 완료");
//
//
//        // ------------------------------------------------------------------
//        // [STEP 2] 가상계좌 발급 (VACCT_ISSUE) 테스트
//        // ------------------------------------------------------------------
//        
//        // 1. 데이터 준비
//        String bankName = "우리은행";
//        String virtualAcct = "1002-123-456789";
//
//        // 2. Mock 동작 정의
//        // 업데이트 성공 리턴
//        when(taxMapper.updateVirtualAccount(any(ImportTaxPaymentDTO.class))).thenReturn(1);
//        
//        // ★ 중요: 업데이트 후 재조회(Select) 시뮬레이션
//        ImportTaxPaymentDTO billAfterVacct = ImportTaxPaymentDTO.builder()
//                .importId(importId)
//                .bankName(bankName)
//                .virtualAcct(virtualAcct)
//                .payStatus("PAY_WAITING")
//                .build();
//        when(taxMapper.selectTaxPaymentByImportId(importId)).thenReturn(billAfterVacct);
//
//        // 3. 서비스 실행
//        int resultVacct = taxService.issueVirtualAccount(importId, bankName, virtualAcct);
//
//        // 4. 검증
//        assertEquals(1, resultVacct);
//        
//        // [핵심] VACCT_ISSUE 로그가 찍혔는지 확인
//        // verify 순서: selectTaxPaymentByImportId가 호출된 후 logService가 호출되었는지
//        verify(taxMapper, times(1)).selectTaxPaymentByImportId(importId); 
//        verify(logService, times(1)).registerLog(any(ImportTaxPaymentDTO.class), eq("VACCT_ISSUE"));
//        System.out.println("✅ STEP 2: 가상계좌 발급 및 로그(VACCT_ISSUE) 검증 완료");
//
//
//        // ------------------------------------------------------------------
//        // [STEP 3] 납부 완료 처리 (PAY_COMP) 테스트
//        // ------------------------------------------------------------------
//
//        // 1. 데이터 준비
//        String payerName = "홍길동";
//
//        // 2. Mock 동작 정의
//        when(taxMapper.updatePayerAndStatus(any(ImportTaxPaymentDTO.class))).thenReturn(1);
//        // 원본 상태 업데이트를 위해 master 조회 다시 필요 (Service 로직상)
//        when(masterMapper.selectImportMaster(importId, "OFFICER")).thenReturn(mockMaster); 
//        
//        // ★ 중요: 납부 완료 후 재조회(Select) 시뮬레이션
//        ImportTaxPaymentDTO billAfterPay = ImportTaxPaymentDTO.builder()
//                .importId(importId)
//                .payStatus("PAY_COMPLETED")
//                .payerName(payerName)
//                .totalAmount(100000L)
//                .build();
//        // 위에서 한 번 호출했으므로, 이번이 두 번째 호출임. (Mock의 행동을 덮어씌우거나 순서대로 리턴 가능)
//        // 여기서는 간단하게 다시 stubbing
//        when(taxMapper.selectTaxPaymentByImportId(importId)).thenReturn(billAfterPay);
//
//        // 3. 서비스 실행
//        int resultPay = taxService.processPayment(importId, payerName);
//
//        // 4. 검증
//        assertEquals(1, resultPay);
//        
//        // 원본 마스터 테이블 상태 업데이트 호출 검증
//        verify(masterMapper).updateImportMasterStatus(importNumber, "PAY_COMPLETED");
//        
//        // [핵심] PAY_COMP 로그가 찍혔는지 확인
//        verify(logService, times(1)).registerLog(any(ImportTaxPaymentDTO.class), eq("PAY_COMP"));
//        System.out.println("✅ STEP 3: 납부 완료 및 로그(PAY_COMP) 검증 완료");
//    }
//}