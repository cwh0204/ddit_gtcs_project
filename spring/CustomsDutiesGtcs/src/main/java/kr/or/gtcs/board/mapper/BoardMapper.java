package kr.or.gtcs.board.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.gtcs.dto.BoardDTO;

@Mapper
public interface BoardMapper {
	// 전체 조회
	public List<BoardDTO> selectBoardList(BoardDTO board);
	// 단건 상세 조회
	public BoardDTO selectBoard(int bdId);
	// 게시판 등록
	public int insertBoard(BoardDTO board);
	// 게시판 수정
	public int updateBoard(BoardDTO board);
	// 게시판 삭제
	public int deleteBoard(BoardDTO board);	
	// 조회수 증가
	public int updateViewCnt(int bdId);
	
}
