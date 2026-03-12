package kr.or.gtcs.member.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import kr.or.gtcs.dto.MemberDTO;
import kr.or.gtcs.member.service.MemberService;
import kr.or.gtcs.security.auth.CustomUserDetailsService;
import kr.or.gtcs.security.auth.MemberDTOWrapper;
import kr.or.gtcs.security.jwt.JwtProvider;
import kr.or.gtcs.util.EmailCheck;

@RestController
@RequestMapping
public class MemberController {
	
	@Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;
	
	@Autowired
	EmailCheck emailCheck;
	
	@Autowired
	MemberService memberService;
	
	@Autowired
	JwtProvider jwtProvider;
	
	//로그인
	@PostMapping("/rest/login")
	@ResponseBody 
	public ResponseEntity<?> memberLogin(@RequestBody MemberDTO member) { // HttpSession은 JWT 방식에선 보통 필요 없습니다.
	    
	    try {
	        UserDetails userDetails = userDetailsService.loadUserByUsername(member.getLoginId());
	        
	        if (!passwordEncoder.matches(member.getPassword(), userDetails.getPassword())) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
	        }

	        Authentication authentication = new UsernamePasswordAuthenticationToken(
	            userDetails, null, userDetails.getAuthorities()
	        );

	        String token = jwtProvider.generateJwt(authentication);

	        // 자바스크립트 res.data.token 구조에 맞게 Map으로 반환
	        Map<String, String> response = new HashMap<>();
	        response.put("token", token);
	        
	        return ResponseEntity.ok(response);

	    } catch (UsernameNotFoundException e) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("사용자를 찾을 수 없습니다.");
	    }
	}
	
	// 아이디 찾기
	@PostMapping("/member/idFind")
	public MemberDTO memberIdFind(@RequestBody MemberDTO member) {
	    MemberDTO result = memberService.memberIdFind(member);
	    return result; 
	}
	
	// 아이디 중복 확인
	@PostMapping("/member/idCheck/{loginId}")
	public String memberIdCheck(@PathVariable("loginId") String loginId) {
		MemberDTO member = new MemberDTO();
		member.setLoginId(loginId);
		boolean Duplicate = memberService.memberIdCheck(member);
		return Duplicate ? "Y" : "N"; // 중복이냐
	}
	
	// 이메일 발송(아이디 찾기)
	@PostMapping("/member/sendIdEmail/{email}") 
	public String memberIdFind(@PathVariable("email") String email) {
		MemberDTO member = new MemberDTO();
		member.setEmail(email);
		MemberDTO result = memberService.memberIdFind(member); // member=dto 변수(db)에 가서 아이디를 찾아와라 
		
		if (result != null) {
		String memberId = result.getLoginId();
		String title = "[G-TCS]의 아이디 찾기 안내";
		String content = "<div style='font-family: sans-serif; line-height: 1.6; color: #333;'>"
                + "  <p>안녕하세요. G-TCS를 이용해 주셔서 감사합니다.</p>"
                + "  <p>요청하신 아이디 정보를 안내해 드립니다.</p>"
                + "  <div style='margin: 30px 0; padding: 30px; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; text-align: center;'>"
                + "     <span style='font-size: 14px; color: #666;'>회원님의 아이디</span><br>"
                + "     <strong style='font-size: 24px; color: #2c3e50; letter-spacing: 1px;'>" + memberId + "</strong>"
                + "  </div>"
                + "  <div style='padding: 15px; background-color: #eff6ff; border-left: 4px solid #007bff; color: #555; font-size: 14px;'>"
                + "     <strong>안내사항:</strong><br>"
                + "     개인정보 보호를 위해 아이디를 확인하신 후 즉시 로그인을 권장하며,<br>"
                + "     비밀번호가 기억나지 않으실 경우 비밀번호 찾기 기능을 이용해 주세요."
                + "  </div>"
                + "  <p style='margin-top: 20px;'>감사합니다.<br>G-TCS 드림</p>"
                + "</div>";
		emailCheck.emailCheck(email, title, content);
		return "Y";
		} else {
			return "N";
		}
	}
	
	// 이메일 발송(비밀번호 찾기)
	@PostMapping("/member/sendPwEmail/{loginId}/{email}")
	public String memberPassFind(@PathVariable("loginId") String loginId, @PathVariable("email") String email) {
	    String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
	    java.security.SecureRandom random = new java.security.SecureRandom();
	    StringBuilder sb = new StringBuilder();
	    for (int i = 0; i < 10; i++) {
	        sb.append(chars.charAt(random.nextInt(chars.length())));
	    }
	    String rawTempPw = sb.toString(); 

	    String encodedPw = passwordEncoder.encode(rawTempPw);

	    MemberDTO member = new MemberDTO();
	    member.setLoginId(loginId);
	    member.setEmail(email);
	    member.setPassword(encodedPw); 

	    String title = "[G-TCS] 임시 비밀번호 발급 안내";
	    String content = "<div style='font-family: sans-serif; line-height: 1.6; color: #333;'>"
	                   + "  <p>안녕하세요, <strong>" + loginId + "</strong>님!</p>"
	                   + "  <p>요청하신 임시 비밀번호를 안내해 드립니다. 아래의 비밀번호로 로그인해 주세요.</p>"
	                   + "  <div style='margin: 30px 0; padding: 30px; background-color: #fff5f5; border: 1px solid #feb2b2; border-radius: 5px; text-align: center;'>"
	                   + "     <span style='font-size: 14px; color: #e53e3e;'>임시 비밀번호</span><br>"
	                   + "     <strong style='font-size: 24px; color: #c53030; letter-spacing: 2px;'>" + rawTempPw + "</strong>"
	                   + "  </div>"
	                   + "  <div style='padding: 15px; background-color: #f8f9fa; border-left: 4px solid #dc3545; color: #555; font-size: 14px;'>"
	                   + "     <strong>주의사항:</strong><br>"
	                   + "     로그인 후 보안을 위해 <b>회원 상세 정보 > 정보 수정</b> 메뉴에서 반드시 새로운 비밀번호로 변경해 주시기 바랍니다."
	                   + "  </div>"
	                   + "  <p style='margin-top: 20px;'>감사합니다.<br>G-TCS 드림</p>"
	                   + "</div>";
	    
	    try {
	        int result = memberService.memberPassFind(member);

	        if (result > 0) {
	            emailCheck.emailCheck(email, title, content);
	            return "Y";
	        }
	    } catch (Exception e) {
	        System.out.println("비밀번호 찾기 실패: " + e.getMessage());
	    }
	    return "N";
	}
	
	// 이메일 인증코드
	@GetMapping("/member/verifyCode/{email}")
	public String sendEmail(@PathVariable String email) {
		String v_code = emailCheck.sendEmailCode(email);		
	    return v_code;
	}
	
	// 이메일 중복확인
	@GetMapping("/member/emailCheck/{email}")
	public String memberEmailCheck(@PathVariable String email) {
		boolean isDuplicate = memberService.memberEmailCheck(email);
		return isDuplicate ? "Y" : "N";
	}
	
	// 회원가입
	@PostMapping("/member/register")
	public String memberInsert(@RequestBody MemberDTO member) {	    
	    String encodedPw = passwordEncoder.encode(member.getPassword());
	    member.setPassword(encodedPw);
	    int result = memberService.memberInsert(member); 
	    
	    if (result > 0) { 
	        return "Y";
	    } else {
	        return "N";
	    }
	}	
	
	// 회원 상세 정보 조회
	@GetMapping("/member/selectMem")
	@ResponseBody
	public MemberDTO memberSelect(MemberDTO memUser) { // HttpSession: 누구나 접근 가능한 일반 서랍장, Authentication: 시큐리티가 관리하는 금고 내부의 인증 정보
	    
//	    if (authentication == null || !authentication.isAuthenticated()) {
//	        System.out.println("인증된 사용자 정보가 없습니다.");
//	        return null;  
//	    }
//	    MemberDTOWrapper wrapper = (MemberDTOWrapper) authentication.getPrincipal();
//	    MemberDTO memUser = wrapper.getRealUser();
	    return memberService.memberselect(memUser);
	}
	
	// 회원 상세 정보 수정
	@PostMapping("/member/updateMem")
	@ResponseBody
	public ResponseEntity<?> memberUpdate(@RequestBody MemberDTO member, Authentication authentication) {
		MemberDTOWrapper wrapper = (MemberDTOWrapper) authentication.getPrincipal();
		member.setMemId(wrapper.getRealUser().getMemId());
		
		if(member.getPassword() != null && !member.getPassword().isEmpty()) {
			member.setPassword(passwordEncoder.encode(member.getPassword()));
		}
		
		memberService.memberUpdate(member);		
		BeanUtils.copyProperties(member, wrapper.getRealUser(), "loginId", "password", "regDate", "modDate", "delYn", "memRole", "customsIdNo", "bizRegNo");
		
		Authentication newAuth = new UsernamePasswordAuthenticationToken(
				wrapper, null, wrapper.getAuthorities()
		);
		
		String newToken = jwtProvider.generateJwt(newAuth);
		
		Map<String, String> response = new HashMap<>();
		response.put("result", "Y");
		response.put("newToken", newToken);
		
		return ResponseEntity.ok(response);
	}

	// 회원 탈퇴
	@PostMapping("/member/deleteMem")
	@ResponseBody
	public String deleteMember(@RequestBody MemberDTO inputData, Authentication authentication) { 
		MemberDTOWrapper wrapper = (MemberDTOWrapper) authentication.getPrincipal();
		MemberDTO realUser = wrapper.getRealUser();
		
		UserDetails userDetails = userDetailsService.loadUserByUsername(realUser.getLoginId());

		if (!passwordEncoder.matches(inputData.getPassword(), userDetails.getPassword())) {
			return "N";
		}
		
		int result = memberService.deleteMember(realUser);
		if (result > 0) {
			SecurityContextHolder.clearContext();
			return "Y";
		}
		return "N";
	}
	
	//세관원 목록 불러오기
	@GetMapping("/rest/officer")
	public List<MemberDTO> findListOfficer() {
		return memberService.findListOfficer();
	}
	
	// 회원 상세 정보 비밀번호 조회 
	@PostMapping("/member/verifyPassword")
	@ResponseBody
	public String memberPwSelect(@RequestBody Map<String, Object> params) {
		        Integer memId = Integer.parseInt(params.get("memId").toString());
		        String inputPassword = params.get("password").toString();
		        
		        String dbPassword = memberService.memberPwSelect(memId);
		        
		        if (dbPassword == null) {
		            return "N";
		        }
		        
		        boolean isCorrect = passwordEncoder.matches(inputPassword, dbPassword);
		        
		        return isCorrect ? "Y" : "N";
		}
	}
	
