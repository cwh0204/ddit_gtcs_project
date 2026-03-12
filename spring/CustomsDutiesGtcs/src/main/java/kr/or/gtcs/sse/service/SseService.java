package kr.or.gtcs.sse.service;

import org.springframework.context.event.ContextClosedEvent; // 💡 이벤트 리스너용 임포트
import org.springframework.context.event.EventListener;        // 💡 이벤트 리스너용 임포트
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Slf4j
@Service
public class SseService {
    
	private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();
	// lsg memId가 전혀 매핑되지 않음 
    //private final Set<SseEmitter> emitters = new CopyOnWriteArraySet<>();

    public SseEmitter subscribe(Long memId) {
    	// lsg. 유효 시간을 0L로 해서 무한대로 60000L -> 0L
        SseEmitter emitter = new SseEmitter(0L); // 유효시간 1분
        
        emitters.put(memId, emitter);
        // lsg 여기도 Map에 맞게 변형
        //emitters.add(emitter);

        // 1. 정상 종료 시
        emitter.onCompletion(() -> emitters.remove(memId));
        //emitter.onCompletion(() -> emitters.remove(emitter));
        
        // 2. 타임아웃 시: 확실하게 파이프라인을 부수고 명단에서 제거
		/*
		 * emitter.onTimeout(() -> { emitter.complete(); emitters.remove(emitter); });
		 */
        emitter.onTimeout(() -> {
            emitter.complete();
            emitters.remove(memId);
        });
        
        // 3. 가장 중요한 추가 로직: 브라우저 강제 종료, 네트워크 에러 발생 시
		/*
		 * emitter.onError((e) -> { emitter.complete(); // 좀비 연결 확실히 죽이기
		 * emitters.remove(emitter); });
		 */
        emitter.onError(e -> {
            emitter.complete();
            emitters.remove(memId);
        });

        try {
            // 첫 연결 시 503 에러 방지용 더미 데이터 발송
            emitter.send(SseEmitter.event().name("CONNECT").data("connected"));
        } catch (IOException e) {
            // 발송 중 에러가 나면 즉시 닫고 제거
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

	/*
	 * @Async("sseExecutor") public void broadcast(String eventName, Object data) {
	 * emitters.forEach(emitter -> { try {
	 * emitter.send(SseEmitter.event().name(eventName).data(data)); } catch
	 * (IOException e) { emitters.remove(emitter); } }); }
	 */
    // @Async("sseExecutor")
    public void broadcast(String eventName, Object data) {
        emitters.forEach((memId, emitter) -> {
            try {
                emitter.send(SseEmitter.event().name(eventName).data(data));
            } catch (IOException e) {
                emitters.remove(memId);
            }
        });
    }

	/*
	 * // 핵심 해결책: 톰캣이 멈추기 '직전'에 가장 먼저 가로채서 연결을 다 폭파시킵니다!
	 * 
	 * @EventListener(ContextClosedEvent.class) public void onAppClose() {
	 * log.info("🛑 [SSE 선제 종료] 스프링 컨텍스트 종료 감지! 톰캣이 대기하기 전에 모든 SSE 연결을 강제로 끊습니다!");
	 * 
	 * for (SseEmitter emitter : emitters) { try { emitter.complete(); // 브라우저에게
	 * "서버 꺼지니까 끊어" 라고 즉시 통보 } catch (Exception e) { // 무시 } } emitters.clear(); //
	 * 싹 비우기 }
	 */
    @EventListener(ContextClosedEvent.class)
    public void onAppClose() {
        log.info("🛑 SSE 종료 감지 - 모든 연결 종료");

        for (Map.Entry<Long, SseEmitter> entry : emitters.entrySet()) {
            try {
            	entry.getValue().send(SseEmitter.event().name("SHUTDOWN").data("Server is shutting down"));
                entry.getValue().complete();
            } catch (Exception ignored) {
            }
        }

        emitters.clear();
    }
    
    @Scheduled(fixedRate = 30000)
    public void heartbeat() {
        broadcast("PING", "keep-alive");
    }
}