package kr.or.gtcs.board;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import kr.or.gtcs.board.mapper.BoardMapper;
import kr.or.gtcs.dto.BoardDTO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootTest
public class BoardMapperTest {
	
	@Autowired
	private  BoardMapper boardMapper;
	
	// 전체 조회
	@Test
	@DisplayName("리스트 가져오기 테스트")
	void testSelectList() {
		BoardDTO dto = new BoardDTO();
	    List<BoardDTO> list = boardMapper.selectBoardList(dto);

	    int cnt =0;
	    for(BoardDTO board : list) {
	    	cnt++;
	    	log.info("board {}",board);
	    }
	    log.info("cnt {} size {}",cnt,list.size());
	    assertEquals(cnt, list.size());	    
	}
	
	// 단건 상세 조회
		@Test
		@Disabled // 테스트 끝난 건 이렇게 해서 다시 하지 않게
		void testselect() {
			int bdId = 85;
			BoardDTO board = boardMapper.selectBoard(bdId);
			System.out.println("Id:" + board.getBdId());
			System.out.println("타입:" + board.getBdType());
			System.out.println("제목:" + board.getBdTitle());
			System.out.println("작성자:" + board.getBdWriter());
			System.out.println("내용:" + board.getBdCont());
			System.out.println("등록일:" + board.getBdRegdate());
			System.out.println("수정일:" + board.getBdModdate());
			System.out.println("조회수:" + board.getBdViewcnt());
			System.out.println("비밀글여부:" + board.getBdSecyn());
			
		}
		
	// 게시판 등록
	@Test
	@Disabled
	void testInsert() {
	    BoardDTO boarddto = new BoardDTO();
	    boarddto.setBdType("공지사항"); 
	    boarddto.setBdTitle("공지사항연습1");
	    boarddto.setBdCont("연습");
	    boarddto.setBdWriter("수민");
	    
	    int result = boardMapper.insertBoard(boarddto);
	    
	    if(result > 0) {
	        log.info("====> 등록 성공! 게시글 제목: {}", boarddto.getBdTitle());
	    } else {
	        log.error("====> 등록 실패ㅠ");
	    }
	}
	
	// 게시판 수정
	@Test
	@Disabled
	void testUpdate() {
	BoardDTO board = new BoardDTO();
	board.setBdId(85);
	
	board.setBdTitle("공지사항 제목 수정테스트");
	board.setBdCont("공지사항 내용 수정테스트");
	int result = boardMapper.updateBoard(board);
	System.out.println("수정 결과 행 수:" + result);
	assertEquals(1, result);
	}
	
	// 게시판 삭제
	@Test
	@Disabled
	void testdelete() {
		BoardDTO board = new BoardDTO();
		board.setBdId(121);
		int result = boardMapper.deleteBoard(board);
		System.out.println("삭제 결과:" + result);
	}
	
	
    // 조회수 증가
		@Test
		@Disabled
		void testUpdateViewCnt() {
			int bdId = 164;
			boardMapper.updateViewCnt(bdId);
			
			BoardDTO board = boardMapper.selectBoard(bdId);
			log.info("게시글 번호: {}, 현재 조회수: {}", bdId, board.getBdViewcnt());
		}
}

