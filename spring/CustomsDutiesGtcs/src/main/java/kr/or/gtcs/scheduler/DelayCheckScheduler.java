package kr.or.gtcs.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import kr.or.gtcs.importmaster.mapper.ImportMasterMapper;
import kr.or.gtcs.exportmaster.mapper.ExportMasterMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class DelayCheckScheduler {

    private final ImportMasterMapper impMapper;
    private final ExportMasterMapper expMapper;

    /**
     * 매일 자정(00:00:00)에 실행되는 3일 지연 체크 스케줄러
     * 제출일로부터 3일이 경과했는데도 처리가 안 된 건을 DELAY_YN = 'Y'로 변경
     */
    @Scheduled(cron = "0 0 0 * * *")
    //@Scheduled(fixedDelay = 5000) // 테스트 시 활성화
    @Transactional(rollbackFor = Exception.class)
    public void updateDelayedDocs() {
        log.info("========== [스케줄러 시작] 수입/수출 신고 3일 지연 검사 ==========");
        
        try {
            // 수입 지연 처리
            int importDelayedCount = impMapper.updateDelayedYn();
            
            // 수출 지연 처리
            int exportDelayedCount = expMapper.updateDelayedYn();
            
            // 로그로 수입/수출 각각 몇 건이 지연 딱지가 붙었는지 확인
            log.info("지연 딱지(Y) 부착 완료 👉 수입: {}건, 수출: {}건", importDelayedCount, exportDelayedCount);
        } catch (Exception e) {
            log.error("지연 상태 업데이트 중 오류 발생", e);
        }
        
        log.info("========== [스케줄러 종료] 수입/수출 신고 3일 지연 검사 ==========");
    }
}