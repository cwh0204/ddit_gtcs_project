//package kr.or.gtcs.log;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.junit.jupiter.api.Assertions.assertNotNull;
//
//import java.time.LocalDate;
//
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.mock.web.MockMultipartFile;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.test.context.TestExecutionListeners;
//import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
//import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
//
//import kr.or.gtcs.dto.ImportMasterDTO;
//import kr.or.gtcs.dto.MemberDTO;
//import kr.or.gtcs.dto.WarehouseStockDTO;
//import kr.or.gtcs.importmaster.mapper.ImportMasterMapper;
//import kr.or.gtcs.importmaster.service.ImportMasterService;
//import kr.or.gtcs.importtaxpayment.service.ImportTaxPaymentService;
//import kr.or.gtcs.security.auth.MemberDTOWrapper;
//import kr.or.gtcs.warehousestock.service.WarehouseStockService;
//
//@SpringBootTest
//// @Transactional // [필수] AI 결과 저장 및 고지서 자동 생성(REQUIRES_NEW) 로직 검증을 위해 제거
//@TestExecutionListeners({
//    DependencyInjectionTestExecutionListener.class,
//    DirtiesContextTestExecutionListener.class
//})
//public class FullFlowLogTest {
//
//    @Autowired private WarehouseStockService stockService;
//    @Autowired private ImportMasterService importService;
//    @Autowired private ImportTaxPaymentService taxService;
//    @Autowired private ImportMasterMapper importMapper;
//
//    private final MockMultipartFile f1 = new MockMultipartFile("f1", "inv.pdf", "application/pdf", "test".getBytes());
//    private final MockMultipartFile f2 = new MockMultipartFile("f2", "con.pdf", "application/pdf", "test".getBytes());
//    private final MockMultipartFile f3 = new MockMultipartFile("f3", "pac.pdf", "application/pdf", "test".getBytes());
//    private final MockMultipartFile f4 = new MockMultipartFile("f4", "etc.pdf", "application/pdf", "test".getBytes());
//
//    @BeforeEach
//    void setUp() {
//        MemberDTO member = new MemberDTO();
//        member.setMemId(1004); 
//        member.setLoginId("tester_admin");
//        member.setMemRole("OFFICER"); 
//        
//        MemberDTOWrapper wrapper = new MemberDTOWrapper(member);
//        SecurityContextHolder.getContext().setAuthentication(
//            new UsernamePasswordAuthenticationToken(wrapper, null, null)
//        );
//    }
//
//    @Test
//    @DisplayName("AI 포함 - 물류 및 통관 전 과정 통합 로그 테스트 (최종)")
//    void traceabilityFullTest() {
//        // 중복 방지를 위한 랜덤 키 (UNIQUE 제약조건 회피)
//        String randomKey = String.valueOf(System.currentTimeMillis()).substring(8);
//        String testContNo = "CONT-" + randomKey;
//
//        // [STEP 1] 보세창고 반입 (WAREHOUSE_STOCK_LOG 생성)
//        WarehouseStockDTO stock = WarehouseStockDTO.builder()
//                .itemName("AI 검증 품목").qty(1000)
//                .warehouseId("WH-MAIN-01") // ★ 기초 데이터 SQL에서 넣은 ID와 일치시켜야 함
//                .positionArea("BONDED-A").contNo(testContNo).memId(1004).grossWeight(150).build();
//        //stockService.registerWarehouseStock(stock);
//        
//        // [STEP 2] 수입신고서 작성 (실제 AI 호출 포함)
//        ImportMasterDTO importDTO = ImportMasterDTO.builder()
//                .importerName("(주)테스트상사").repName("최상철").telNo("010-1234-5678").email("test@gtcs.kr")
//                .bizRegNo("1234567890").customsId("P123456789012").address("대전광역시 중구").memId(1004)
//                .overseasBizName("Global Supply").overseasCountry("US").importType("일반수입")
//                .cargoMgmtNo("CARGO" + randomKey).transMode("SEA")
//                .arrivalEstDate(LocalDate.now()).bondedInDate(LocalDate.now())
//                .invoiceNo("INV-" + randomKey).invoiceDate(LocalDate.now())
//                .contractNo("CON-" + randomKey).contractDate(LocalDate.now())
//                .poNo("PO-" + randomKey).poDate(LocalDate.now())
//                .incoterms("CIF").currencyCode("USD").payAmount(50000.0)
//                .freightCurrency("KRW").freightAmt(500000.0).insuranceCurrency("KRW").insuranceAmt(100000.0)
//                .addAmtCurrency("KRW").addAmt(0.0) 
//                .totalWeight(150.5).totalTaxBase(60000000L).totalTaxSum(11280000L)
//                .contNo(testContNo).hsCode("8542311000").taxType("A").taxBaseType("AD")
//                .itemNameDeclared("CPU").itemNameTrade("CPU").modelName("I9-GEN").qty(1000.0).qtyUnit("PCS")
//                .unitPrice(50.0).totalAmount(50000.0).netWeight(140.0).taxBaseAmtItem(60000000L)
//                .originCode("US").originMarkYn("Y").status("WAITING")
//                .build();
//
//        importService.registerImportMaster(importDTO, f1, f2, f3, f4);
//        
//        // [매퍼 반영] ID로 객체 조회 후 신고번호 확보
//        String importId = importDTO.getImportId();
//        ImportMasterDTO saved = importMapper.selectImportMasterImportId(importId);
//        
//        assertNotNull(saved, "DB에서 데이터를 찾을 수 없습니다.");
//        String importNumber = saved.getImportNumber();
//
//        // [STEP 3] 세관원 승인 (ACCEPTED) -> 세금 고지서 자동 생성 트리거
//        importService.modifyImportMasterStatus(importNumber, "ACCEPTED", "AI 분석 결과 적합", "CHK-" + randomKey, "1004");
//
//        // [STEP 4] 세금 납부 처리
//        taxService.processPayment(importId, "최상철");
//
//        // [STEP 5] 창고 최종 반출 (LOG: OUTBOUND 생성)
//        stock.setDelYn("Y");
////        int res5 = stockService.modifyOutboundWarehouseStock(stock);
//        
////        assertEquals(1, res5);
//        System.out.println(">>> [SUCCESS] AI 포함 전 과정 물류 흐름 테스트 완료!");
//    }
//}