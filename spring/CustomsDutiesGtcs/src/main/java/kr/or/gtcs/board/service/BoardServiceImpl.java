package kr.or.gtcs.board.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import kr.or.gtcs.attachents.service.AttachentsService;
import kr.or.gtcs.board.mapper.BoardMapper;
import kr.or.gtcs.commons.exception.SystemFailureException;
import kr.or.gtcs.dto.BoardDTO;
import kr.or.gtcs.util.FileUtils;

@Service
public class BoardServiceImpl implements BoardService {

	@Autowired
	BoardMapper boardMapper;
	@Autowired
	AttachentsService attService;
	
	// 게시판 전체 조회
	@Override
	public List<BoardDTO> findBoardList(BoardDTO board) {
		return boardMapper.selectBoardList(board);
	}
		
	// 게시판 등록
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int registerBoard(BoardDTO board, Map<String, MultipartFile> fileMap) {
		try {
		int result = boardMapper.insertBoard(board);
		if(fileMap != null && !fileMap.isEmpty()) {
		attService.uploadMultipleFiles(board.getBdId().toString(), "board", fileMap);
		}
		return result;
		} catch (Exception e) {
			e.printStackTrace();
			throw new SystemFailureException("시스템 오류가 발생했습니다 관리자에게 문의하세요");
		}
	}

	// 단건 상세 조회
	@Override
	public BoardDTO findBoard(int bdId) {
		return boardMapper.selectBoard(bdId);
	}

	// 게시판 수정 
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int modifyBoard(BoardDTO board, Map<String, MultipartFile> fileMap) {
		try {
		int result = boardMapper.updateBoard(board);
		if(fileMap != null && !fileMap.isEmpty()) {
		attService.uploadMultipleFiles(board.getBdId().toString(), "board", fileMap);
		}
		return result;
		} catch (Exception e) {
			e.printStackTrace();
			throw new SystemFailureException("시스템 오류가 발생했습니다 관리자에게 문의하세요");
		}
	}

	// 게시판 삭제 
	@Override
	public int modifyBoardDelete(BoardDTO bdId) {
		return boardMapper.deleteBoard(bdId);
	}

	// 조회수 증가
	@Override
	public int modifyViewCnt(int bdId) {
		return boardMapper.updateViewCnt(bdId);
	}
}
