package kr.or.gtcs.member.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpSession;
import kr.or.gtcs.dto.MemberDTO;
import kr.or.gtcs.member.mapper.MemberMapper;
import kr.or.gtcs.util.EmailCheck;

@Service
public class MemberServiceImpl implements MemberService{

	@Autowired
	HttpSession session;
	
	@Autowired
	MemberMapper memberMapper;
	
	@Autowired
	EmailCheck emailCheck;
		
	// 아이디 중복확인
	@Override
	public boolean memberIdCheck(MemberDTO member) {
		return memberMapper.memberIdCheck(member);
	}

	// 회원가입(비밀번호 암호화)
	@Override
	public int memberInsert(MemberDTO member) {
		return memberMapper.memberInsert(member);
	}
	
	// 로그인(비밀번호 암호화)
	@Override
	public MemberDTO memberLogin(MemberDTO member) {
	    return memberMapper.memberLogin(member.getLoginId());
	}
	
	// 아이디 찾기
	@Override
	public MemberDTO memberIdFind(MemberDTO member) {
	    return memberMapper.memberIdFind(member);
	}

	// 비밀번호 찾기
	@Override
	public MemberDTO memberPassFind(MemberDTO member) {
		return memberMapper.memberPassFind(member);
	}

	// 이메일 기능
	@Override
	public MemberDTO sendEmail(String email) {	
		return null;
	}
	
	// 이메일 중복확인
	@Override
	public boolean memberEmailCheck(String email) {
		return memberMapper.memberEmailCheck(email);
	}

	// 인증코드 검증
	@Override
	public boolean verifyCode(String authCode) {
		String saveCode = (String) session.getAttribute("authCode");
		return authCode.equals(saveCode);
	}

	// 회원 상세 정보 조회
	@Override
	public MemberDTO memberselect(MemberDTO member) {
		return memberMapper.memberselect(member);
	}
	
	// 회원 상세 정보 수정
	@Override
	public int memberUpdate(MemberDTO member) {
	return memberMapper.memberUpdate(member);
	}

	// 회원 탈퇴
	@Override
	public int deleteMember(MemberDTO member) {
		return memberMapper.deleteMember(member);
	}
	
	//세관원 목록 불러오기
	@Override
	public List<MemberDTO> findListOfficer() {
		return memberMapper.selectListOfficer();
	}
}
