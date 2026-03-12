package kr.or.gtcs.sse.controller;

import kr.or.gtcs.sse.service.SseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/rest/sse")
@RequiredArgsConstructor
public class SseController {
    private final SseService sseService;

    @GetMapping(value = "/stream", produces = "text/event-stream")
    public SseEmitter stream(@RequestParam Long memId) {
        return sseService.subscribe(memId);
    }
}