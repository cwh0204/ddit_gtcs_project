package kr.or.gtcs.comment;

import java.util.List;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import kr.or.gtcs.comment.mapper.CommentMapper;
import kr.or.gtcs.dto.CommentDTO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootTest
public class CommentMapperTest {
	
	@Autowired
	private CommentMapper commentMapper;
	
	// 전체 댓글 조회
	@Test
	@Disabled
	void testSelectList() {
		int bdId = 166;
		List<CommentDTO> list = commentMapper.selectCommentList(bdId);
		
		for(CommentDTO comment : list) {
			log.info("comment {}", comment);
		}
	}
	
	// 댓글 등록
	@Test
	@Disabled
	void testInsert() {
		CommentDTO cmtdto = new CommentDTO();
		cmtdto.setBdId(164);
		cmtdto.setReContent("민원사항 댓글 테스트!");
	    cmtdto.setReWriter("test02");
	    
	    int result = commentMapper.insertComment(cmtdto);
	    log.info("등록된 행 개수:" + result);
	   
	}
	
	// 댓글 수정
	@Test
	@Disabled
	void testUpdateComment() {
	    CommentDTO comment = new CommentDTO();
	    comment.setReId(22);
	    comment.setReContent("댓글 내용 수정 테스트입니다.");

	    int result = commentMapper.updateComment(comment);
	    log.info("수정 결과: {}", result);
	}
	
	// 댓글 삭제
	@Test
	void testdeleteComment() {
		CommentDTO comment = new CommentDTO();
		comment.setReId(27);
		int result = commentMapper.deleteComment(comment);
		log.info("삭제 결과:" + result);
	}

}
