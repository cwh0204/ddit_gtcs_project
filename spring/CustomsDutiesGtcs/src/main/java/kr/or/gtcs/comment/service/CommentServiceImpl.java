package kr.or.gtcs.comment.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.gtcs.comment.mapper.CommentMapper;
import kr.or.gtcs.dto.CommentDTO;

@Service
public class CommentServiceImpl implements CommentService {
	
	@Autowired
	CommentMapper commentMapper;
	
	// 댓글 등록
	@Override
	public int registerComment(CommentDTO comment) {
		return commentMapper.insertComment(comment);
	}

	// 전체 댓글 조회
	@Override
	public List<CommentDTO> findCommentList(int bdId) {
		return commentMapper.selectCommentList(bdId);
	}

	// 댓글 수정
	@Override
	public int modifyComment(CommentDTO comment) {
		return commentMapper.updateComment(comment);
	}

	// 댓글 삭제
	@Override
	public int modifyCommentDelete(CommentDTO comment) {
		return commentMapper.deleteComment(comment);
	}

}
