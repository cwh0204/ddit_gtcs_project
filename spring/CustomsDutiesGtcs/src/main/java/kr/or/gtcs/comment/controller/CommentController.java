package kr.or.gtcs.comment.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.gtcs.comment.service.CommentService;
import kr.or.gtcs.dto.CommentDTO;
import kr.or.gtcs.security.auth.MemberDTOWrapper;

@RestController
@RequestMapping("/rest/comment")
public class CommentController {
	
	@Autowired
	CommentService commentService;
	
	// 댓글 등록
	@PostMapping("/createCmt")
	public String registerComment(@RequestBody CommentDTO comment, @AuthenticationPrincipal MemberDTOWrapper user) {
	    comment.setReWriter(user.getRealUser().getMemName());
	    int result = commentService.registerComment(comment);
	    return (result > 0) ? "Y" : "N";
	}
	
	// 전체 댓글 조회
	@GetMapping("/cmtList")
	public List<CommentDTO> findCommentList(@RequestParam("bdId") int bdId) {
		return commentService.findCommentList(bdId);
	}
	
	// 댓글 수정
	@PutMapping("/cmtModify") 
	public String modifyComment(@RequestBody CommentDTO comment, Authentication authentication) {
		MemberDTOWrapper principal = (MemberDTOWrapper) authentication.getPrincipal();
		String myCmt = principal.getRealUser().getMemName();
		
		if(!myCmt.equals(comment.getReWriter())){
		   return "N";	
		}
		
		int result = commentService.modifyComment(comment);
	    return (result > 0) ? "Y" : "N";
	}
	
	// 댓글 삭제
	@DeleteMapping("/cmtDelete")
	public String modifyCommentDelete(@RequestParam int reId, Authentication authentication) {
		MemberDTOWrapper principal = (MemberDTOWrapper) authentication.getPrincipal();
		String myCmt = principal.getRealUser().getMemName();
		
		CommentDTO comment = new CommentDTO();
		comment.setReId(reId);
		comment.setReWriter(myCmt);
		
		int result = commentService.modifyCommentDelete(comment);
		return (result > 0) ? "Y" : "N";	
	}
}
