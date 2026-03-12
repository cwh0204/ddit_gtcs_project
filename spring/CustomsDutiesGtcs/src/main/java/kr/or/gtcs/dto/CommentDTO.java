package kr.or.gtcs.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class CommentDTO {
	// 댓글 고유 번호
	private Integer reId;
	// 연결된 게시글 번호
	private Integer bdId;
	// 댓글 내용
	private String reContent;
	// 댓글 작성자
	private String reWriter;
	// 부모 댓글 번호
	private Integer parentId;
	// 댓글 등록 일시
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate reRegdate;
	// 삭제 여부
	private String reDelyn;

}
