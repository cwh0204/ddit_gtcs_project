package kr.or.gtcs.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@EnableAsync // 스프링의 비동기 처리를 활성화
@Configuration
public class AsyncConfig {

    @Bean(name = "sseExecutor")
    public Executor sseExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);      // 기본적으로 유지할 스레드 개수
        executor.setMaxPoolSize(10);     // 최대 스레드 개수
        executor.setQueueCapacity(50);   // 10개가 꽉 찼을 때 대기열 크기
        executor.setThreadNamePrefix("SSE-Async-"); // 로그에서 확인하기 위한 이름
        
        // [서버 종료 최적화] 애플리케이션 종료 시 큐에 남은 작업이 끝날 때까지 기다림
        executor.setWaitForTasksToCompleteOnShutdown(true); 
        // 최대 10초까지만 기다리고 안전하게 스레드 풀 종료
        executor.setAwaitTerminationSeconds(10);
        
        executor.initialize();
        return executor;
    }
}