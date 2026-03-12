package kr.or.gtcs.sse.service;

import org.springframework.context.SmartLifecycle;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
// 핵심: SmartLifecycle 인터페이스를 구현합니다.
public class SseService implements SmartLifecycle {
    
    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();
    private volatile boolean isRunning = false; // 서비스 실행 상태

    // ==========================================
    // 1. 기존 로직 (subscribe, sendTo, broadcast)
    // ==========================================
    public SseEmitter subscribe(Long memId) {
        SseEmitter emitter = new SseEmitter(0L); 
        emitters.put(memId, emitter);

        emitter.onCompletion(() -> emitters.remove(memId));
        emitter.onTimeout(() -> {
            emitter.complete();
            emitters.remove(memId);
        });
        emitter.onError(e -> {
            emitter.complete();
            emitters.remove(memId);
        });

        try {
            emitter.send(SseEmitter.event().name("CONNECT").data("connected"));
        } catch (IOException e) {
            emitter.complete(); 
            emitters.remove(memId);
        }
        return emitter;
    }
    
    public void sendTo(Long memId, String eventName, Object data) {
        SseEmitter emitter = emitters.get(memId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name(eventName).data(data));
            } catch (IOException e) {
                emitters.remove(memId);
            }
        }
    }

    public void broadcast(String eventName, Object data) {
        emitters.forEach((memId, emitter) -> {
            try {
                emitter.send(SseEmitter.event().name(eventName).data(data));
            } catch (IOException e) {
                emitters.remove(memId);
            }
        });
    }

    @Scheduled(fixedRate = 30000)
    public void heartbeat() {
        broadcast("PING", "keep-alive");
    }

    // ==========================================
    // 2. [새로운 해결책] SmartLifecycle 오버라이드
    // ==========================================
    @Override
    public void start() {
        this.isRunning = true;
    }

    @Override
    public boolean isRunning() {
        return this.isRunning;
    }

    /**
     * 이 값이 핵심
     * 스프링 부트 내장 톰캣의 종료 Phase는 (Integer.MAX_VALUE - 1) 입니다.
     * 따라서 이 값을 Integer.MAX_VALUE로 주면, 톰캣이 30초 대기를 시작하기 "가장 먼저" 이 클래스의 stop()이 실행됩니다.
     */
    @Override
    public int getPhase() {
        return Integer.MAX_VALUE;
    }

    /**
     * 기존의 @EventListener(ContextClosedEvent.class)를 대체합니다.
     */
    @Override
    public void stop() {
        log.info("톰캣 Graceful Shutdown 대기 시작 전 선제적으로 모든 SSE 연결을 강제 폭파");

        for (Map.Entry<Long, SseEmitter> entry : emitters.entrySet()) {
            try {
                entry.getValue().send(SseEmitter.event().name("SHUTDOWN").data("Server is shutting down"));
                entry.getValue().complete(); // 여기서 연결을 다 끊음
            } catch (Exception ignored) {
            }
        }

        emitters.clear();
        this.isRunning = false;
    }
}