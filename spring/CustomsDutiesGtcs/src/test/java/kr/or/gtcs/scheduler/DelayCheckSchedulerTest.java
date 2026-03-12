//package kr.or.gtcs.scheduler;
//
//import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
//import static org.mockito.BDDMockito.given;
//import static org.mockito.BDDMockito.willThrow;
//import static org.mockito.Mockito.times;
//import static org.mockito.Mockito.verify;
//
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//
//import kr.or.gtcs.importmaster.mapper.ImportMasterMapper;
//
//@ExtendWith(MockitoExtension.class)
//public class DelayCheckSchedulerTest {
//
//    @Mock
//    private ImportMasterMapper impMapper;
//
//    @InjectMocks
//    private DelayCheckScheduler delayCheckScheduler;
//
//    @Test 
//    @DisplayName("3일 지연 수입신고서 업데이트 로직이 정상적으로 호출되는지 테스트")
//    void updateDelayedImports_Success() {
//        // Given (준비): DB에서 3건이 업데이트되었다고 가정.
//        given(impMapper.updateDelayedYn()).willReturn(3);
//
//        // When (실행): 스케줄러 메서드를 수동으로 호출.
//        delayCheckScheduler.updateDelayedImports();
//
//        // Then (검증): impMapper의 updateDelayedYn() 메서드가 정확히 1번 호출되었는지 확인.
//        verify(impMapper, times(1)).updateDelayedYn();
//    }
//
//    @Test
//    @DisplayName("DB 오류 등 예외 발생 시 스케줄러가 중단되지 않고 로깅 후 넘어가는지 테스트")
//    void updateDelayedImports_ExceptionHandling() {
//        // Given (준비): Mapper 호출 시 강제로 RuntimeException을 발생.
//        willThrow(new RuntimeException("DB 연결 끊김 테스트 예외"))
//            .given(impMapper).updateDelayedYn();
//
//        // When & Then (실행 및 검증): 
//        // 예외가 발생하더라도 스케줄러 내부의 try-catch가 방어하므로 
//        // 메서드 밖으로 예외가 던져지지 않아야(assertDoesNotThrow) 정상.
//        assertDoesNotThrow(() -> delayCheckScheduler.updateDelayedImports());
//        
//        // 그럼에도 불구하고 메서드 자체는 1번 호출되었음을 확인.
//        verify(impMapper, times(1)).updateDelayedYn();
//    }
//}