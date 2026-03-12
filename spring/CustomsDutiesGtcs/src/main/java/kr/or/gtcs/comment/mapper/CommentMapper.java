package kr.or.gtcs.comment.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.gtcs.dto.CommentDTO;

@Mapper
public interface CommentMapper {
	// 전체 댓글 조회
	public List<CommentDTO> selectCommentList(int bdId);
	// 댓글 등록
	public int insertComment(CommentDTO comment);
	// 댓글 수정
	public int updateComment(CommentDTO comment);
	// 댓글 삭제
    public int deleteComment(CommentDTO comment);
}
