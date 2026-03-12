package kr.or.gtcs.dashboard.controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import kr.or.gtcs.dashboard.service.DashboardService;
import kr.or.gtcs.dto.DashboardDTO;
import kr.or.gtcs.security.auth.MemberDTOWrapper;
import kr.or.gtcs.dto.MemberDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@RestController
@RequestMapping("/rest/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;
    @GetMapping
    public ResponseEntity<DashboardDTO> getDashboardData(
            Authentication authentication,
            @RequestParam(value = "memId", required = false) Long paramMemId) {

        Long memId = null;

        /* 1) JWT Authentication에서 memId 추출 */
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            log.info("principal class = {}", principal.getClass().getName());
            log.info("principal value = {}", principal);

            if (principal instanceof MemberDTOWrapper wrapper) {
                var realUser = wrapper.getRealUser();
                if (realUser != null && realUser.getMemId() != null) {
                    memId = realUser.getMemId().longValue();
                }
            }
        }

        /* 2) JWT에서 추출 실패 시 프론트에서 전달한 memId 파라미터 사용 (폴백) */
        if ((memId == null || memId <= 0) && paramMemId != null && paramMemId > 0) {
            memId = paramMemId;
            log.info("대시보드 - JWT 추출 실패, 파라미터 memId 사용: {}", memId);
        }

        if (memId == null || memId <= 0) {
            log.warn("대시보드 조회 실패 - memId 추출 실패");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        log.info("대시보드 조회 - 최종 memId: {}", memId);
        return ResponseEntity.ok(dashboardService.getDashboardData(memId));
    }
}