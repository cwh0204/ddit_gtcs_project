package kr.or.gtcs.sse.aspect;

import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import kr.or.gtcs.sse.service.SseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class SseAspect {
    private final SseService sseService;

    // 1. 수입 신고(Import) 관련 데이터 변동 감지
    @AfterReturning(
        "execution(* kr.or.gtcs.importmaster.controller.ImportMasterController.register*(..)) || " +
        "execution(* kr.or.gtcs.importmaster.controller.ImportMasterController.modify*(..))"
    )
    public void fireImportChange() {
        log.info(" [SSE 비동기 AOP] 수입 신고 데이터 변동! IMPORT_REFRESH 신호 발송");
        // 이전 단계에서 만든 비동기 broadcast 메서드 사용
        sseService.broadcast("IMPORT_REFRESH", "IMPORT_CHANGED");
    }

    // 2. 수출 신고(Export) 관련 데이터 변동 감지
    @AfterReturning(
        "execution(* kr.or.gtcs.exportmaster.controller.ExportMasterController.register*(..)) || " +
        "execution(* kr.or.gtcs.exportmaster.controller.ExportMasterController.modify*(..))"
    )
    public void fireExportChange() {
        log.info("[SSE 비동기 AOP] 수출 신고 데이터 변동! EXPORT_REFRESH 신호 발송");
        sseService.broadcast("EXPORT_REFRESH", "EXPORT_CHANGED");
    }

    // 3. 창고 재고(Warehouse) 관련 데이터 변동 감지
    @AfterReturning(
        "execution(* kr.or.gtcs.warehousestock.controller.WarehouseStockController.register*(..)) || " +
        "execution(* kr.or.gtcs.warehousestock.controller.WarehouseStockController.modify*(..))"
    )
    public void fireWarehouseChange() {
        log.info("[SSE 비동기 AOP] 창고 재고 데이터 변동! WAREHOUSE_REFRESH 신호 발송");
        sseService.broadcast("WAREHOUSE_REFRESH", "WAREHOUSE_CHANGED");
    }
}