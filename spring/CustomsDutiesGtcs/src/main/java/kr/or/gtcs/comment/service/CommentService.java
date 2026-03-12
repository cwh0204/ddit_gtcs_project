package kr.or.gtcs.comment.service;

import java.util.List;

import kr.or.gtcs.dto.CommentDTO;

public interface CommentService {
	// 댓글 등록
	public int registerComment(CommentDTO comment);	
	// 전체 댓글 조회
	public List<CommentDTO> findCommentList(int bdId);
	// 댓글 수정
	public int modifyComment(CommentDTO comment);
	// 댓글 삭제
	public int modifyCommentDelete(CommentDTO comment);
}
