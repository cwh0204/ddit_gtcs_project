package kr.or.gtcs.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.or.gtcs.security.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;


@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter{

	private final JwtProvider jwtProvider;
	 
	
	
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
    	String path = request.getRequestURI();
        
        // 1. 로그인 관련 경로는 토큰 검사 없이 바로 다음 필터로 넘김
        if (path.startsWith("/rest/login") || path.startsWith("/member/auth/session/login")) {
            filterChain.doFilter(request, response);
            return;
        }
    	
        // 1. 헤더에서 토큰 추출
        String bearerToken = request.getHeader("Authorization");
        
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            
            // 2. 토큰 검증 (JwtProvider에 검증 로직이 있어야 함)
            if (jwtProvider.validateToken(token)) {
                // 3. 토큰이 유효하면 시큐리티 홀더에 인증 정보 저장
                Authentication authentication = jwtProvider.getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        
        filterChain.doFilter(request, response); // 다음 필터로 진행
    }
}
