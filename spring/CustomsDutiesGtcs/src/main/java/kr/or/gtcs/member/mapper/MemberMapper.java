package kr.or.gtcs.member.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.gtcs.dto.MemberDTO;

@Mapper
public interface MemberMapper {
	// 로그인
	public MemberDTO memberLogin(String loginId);
	// 아이디 찾기
	public MemberDTO memberIdFind(MemberDTO member);
	// 비밀번호 찾기
	public MemberDTO memberPassFind(MemberDTO member);
	// 아이디 중복
	public boolean memberIdCheck(MemberDTO member);
	// 회원가입
	public int memberInsert(MemberDTO member);
	// 이메일 중복 확인
	boolean memberEmailCheck(String email);
	// 회원 상세 정보 조회 
    public MemberDTO memberselect(MemberDTO member);
	// 회원 상세 정보 수정
	public int memberUpdate(MemberDTO member);
	// 회원 삭제
	public int deleteMember(MemberDTO member);
	// 세관원목록 불러오기
	public List<MemberDTO> selectListOfficer();
}
