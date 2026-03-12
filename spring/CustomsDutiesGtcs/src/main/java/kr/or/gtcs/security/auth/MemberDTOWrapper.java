                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 package kr.or.gtcs.security.auth;

import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;

import kr.or.gtcs.dto.MemberDTO;
import lombok.ToString;
@ToString(callSuper = true)
public class MemberDTOWrapper extends User{
	private final MemberDTO realUser;
	
	public MemberDTOWrapper(MemberDTO realUser) {
		super(
			realUser.getLoginId(), 
			realUser.getPassword(), 
			AuthorityUtils.createAuthorityList(realUser.getMemRole())
		);
		this.realUser = realUser;
	}
	
	public MemberDTO getRealUser() {
		return realUser;
	}
}
