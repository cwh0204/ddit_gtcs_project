package kr.or.gtcs.security.jwt;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import kr.or.gtcs.dto.MemberDTO;
import kr.or.gtcs.security.auth.MemberDTOWrapper;

@Component
public class JwtProvider {
	
	@Autowired
    private UserDetailsService userDetailsService;
	
	@Value("${jwt.secret-key}")
	private byte[] sharedSecret;
	private final long VALIDTIME = 1000L * 60 * 60 * 6; //6시간
	
	public String generateJwt(Authentication authentication) {
		MemberDTOWrapper principal = (MemberDTOWrapper) authentication.getPrincipal();
		MemberDTO realUser = principal.getRealUser();
		Map<String, Object> realUserClaim = Map.of(
			"memId", realUser.getMemId(),
			"loginId", realUser.getLoginId(),
			"memName", realUser.getMemName(),
			"memRole", realUser.getMemRole(),
			"repName", realUser.getRepName()
			
		);
		
		try {

			JWSSigner signer = new MACSigner(sharedSecret);

			JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
			    .subject(authentication.getName())
			    .claim("roles", authentication.getAuthorities().stream().map(ga->ga.getAuthority()).toList())
			    .claim("realUser", realUserClaim)
			    .issueTime(new Date()) // iat
			    .expirationTime(new Date(new Date().getTime() + VALIDTIME))
			    .build();

			SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claimsSet);

			signedJWT.sign(signer);

			String token = signedJWT.serialize();
			return token;
		} catch (JOSEException e) {
			throw new RuntimeException(e);
		}
	}
	
	public boolean validateToken(String token) {
	    try {
	        // 1. 토큰 파싱
	        SignedJWT signedJWT = SignedJWT.parse(token);

	        // 2. 서명 검증 (서버의 Secret Key로 만든 검증기)
	        MACVerifier verifier = new MACVerifier(sharedSecret);
	        
	        // 3. 서명이 유효한지 + 유효기간(Expiration)이 남았는지 확인
	        boolean isValid = signedJWT.verify(verifier);
	        boolean isNotExpired = new Date().before(signedJWT.getJWTClaimsSet().getExpirationTime());

	        return isValid && isNotExpired;
	    } catch (Exception e) {
	        // 토큰이 변조되었거나, 형식이 잘못되었거나, 만료된 경우 모두 false
	        System.out.println("JWT 검증 실패: " + e.getMessage());
	        return false;
	    }
	}
	
	public Authentication getAuthentication(String token) {
	    try {
	        SignedJWT signedJWT = SignedJWT.parse(token);
	        JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
	        
	        Map<String, Object> realUserMap = (Map<String, Object>) claims.getClaim("realUser");
	        
	        MemberDTO memberDTO = new MemberDTO();
	        Object memIdObj = realUserMap.get("memId");
	        memberDTO.setMemId(memIdObj instanceof Number n ? n.intValue() : null);
	        memberDTO.setLoginId((String) realUserMap.get("loginId"));
	        memberDTO.setMemName((String) realUserMap.get("memName"));
	        memberDTO.setMemRole((String) realUserMap.get("memRole"));
	        memberDTO.setRepName((String) realUserMap.get("repName"));
	        memberDTO.setPassword(""); // Security 필수값

	        List<String> roles = (List<String>) claims.getClaim("roles");
	        List<SimpleGrantedAuthority> authorities = roles == null ? List.of() : roles.stream()
	                .map(SimpleGrantedAuthority::new)
	                .toList();

	        MemberDTOWrapper userDetails = new MemberDTOWrapper(memberDTO);

	        return new UsernamePasswordAuthenticationToken(userDetails, null, authorities);

	    } catch (Exception e) {
	        throw new RuntimeException("JWT 인증 객체 생성 실패", e);
	    }
	}
	
}









