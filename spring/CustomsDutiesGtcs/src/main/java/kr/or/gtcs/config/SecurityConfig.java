package kr.or.gtcs.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import jakarta.servlet.DispatcherType;
import kr.or.gtcs.security.jwt.JwtProvider;

@Configuration
@EnableWebSecurity // 스프링 시큐리티 기능 활성화
public class SecurityConfig {
	
	@Autowired
	private JwtProvider jwtProvider;
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}
	
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}
	
	@Bean
	public SecurityFilterChain restSecurityFilterChain(HttpSecurity http) throws Exception {
	    http
	        .cors(cors -> cors.configurationSource(request -> {
	            var config = new org.springframework.web.cors.CorsConfiguration();
	            config.setAllowedOriginPatterns(java.util.List.of("*"));
	            config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
	            config.setAllowedHeaders(java.util.List.of("*"));
	            config.setAllowCredentials(true);
	            return config;
	        }))
	        .csrf(csrf -> csrf.disable())
	        .formLogin(form -> form.disable())
	        .httpBasic(basic -> basic.disable())
	        // 세션 정책 추가
	        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	        
	        .authorizeHttpRequests(auth -> auth
	        	.dispatcherTypeMatchers(DispatcherType.FORWARD).permitAll()
	            .requestMatchers("/rest/login", "/member/auth/session/login").permitAll()
	            .requestMatchers("/css/**", "/js/**", "/images/**").permitAll()
	            .requestMatchers("/rest/board/list").permitAll()
	            .requestMatchers("/rest/board/detail").permitAll()
	            .requestMatchers("/client/information/notice/**").permitAll()
	            .requestMatchers("/rest/sse/**").permitAll()
	            .requestMatchers("/rest/**").authenticated()
	            .anyRequest().permitAll()
	        )
	        .addFilterBefore(new JwtAuthenticationFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class);

	    return http.build();
	}
	
}

