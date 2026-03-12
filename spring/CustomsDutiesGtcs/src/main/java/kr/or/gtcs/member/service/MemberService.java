package kr.or.gtcs.member.service;

import java.util.List;

import kr.or.gtcs.dto.MemberDTO;

public interface MemberService {
	// 로그인
	public MemberDTO memberLogin(MemberDTO member);
	// 아이디 찾기
	public MemberDTO memberIdFind(MemberDTO member);
	// 비밀번호 찾기
	public MemberDTO memberPassFind(MemberDTO member);

	// 아이디 중복확인
	public boolean memberIdCheck(MemberDTO member);
	
	// 이메일 기능
	public MemberDTO sendEmail(String email);
	
	// 이메일 중복확인
	public boolean memberEmailCheck(String email);
	
	// 인증코드 검증
	public boolean verifyCode(String authCode);
	
	// 회원가입
	public int memberInsert(MemberDTO member);
	
	// 회원 상세 정보 조회
	public MemberDTO memberselect(MemberDTO member);
	
	// 회원 상세 정보 수정
	public int memberUpdate(MemberDTO member);

	// 회원 삭제
	public int deleteMember(MemberDTO member);
	//세관원 목록 불러오기
	public List<MemberDTO> findListOfficer();
}
