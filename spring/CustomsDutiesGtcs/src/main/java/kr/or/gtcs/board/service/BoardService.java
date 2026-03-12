package kr.or.gtcs.board.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import kr.or.gtcs.dto.BoardDTO;

public interface BoardService {
	// 게시판 전체조회
	public List<BoardDTO> findBoardList(BoardDTO board);
	// 게시판 등록
	public int registerBoard(BoardDTO board, Map<String, MultipartFile> fileMap);
	// 단건 상세 조회
	public BoardDTO findBoard(int bdId);
	// 게시판 수정
	public int modifyBoard(BoardDTO board, Map<String, MultipartFile> fileMap);
	// 게시판 삭제
	public int modifyBoardDelete(BoardDTO board);
	// 조회수 증가
	public int modifyViewCnt(int bdId);
}
