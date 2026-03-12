package kr.or.gtcs.security.auth;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import kr.or.gtcs.dto.MemberDTO;
import kr.or.gtcs.member.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
	private final MemberMapper mapper;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		MemberDTO member = mapper.memberLogin(username);
		
		if(member == null) {
			throw new UsernameNotFoundException("해당 아이디를 찾을 수 없습니다" + username);
		}
		
		return new MemberDTOWrapper(member);
	}	

//	@Override
//	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//		log.info("loadUserByUsername에 왔디용: {}",username);
//		MemberDTO realUser = mapper.memberLogin(username);
//		if(realUser==null) {
//			throw new UsernameNotFoundException("%s 사용자 없음.".formatted(username));
//		}
//		return new MemberDTOWrapper(realUser);
//	}
	
	

}
