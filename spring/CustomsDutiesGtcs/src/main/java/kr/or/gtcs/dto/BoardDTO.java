package kr.or.gtcs.dto;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class BoardDTO {
	// 게시글 번호
	private Integer bdId;
	// 분류(공지사항, 민원사항, 행정예고)
	private String bdType;
	// 제목
	private String bdTitle;
	// 내용
	private String bdCont;
	// 작성자 ID
	private String bdWriter;
	// 등록일
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate bdRegdate;
	// 수정일
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate bdModdate;
	// 조회수
	private Integer bdViewcnt;
	// 비밀글 여부(Y/N)
	private String bdSecyn;
	// 삭제 여부(Y/N)
	private String bdDelyn;
	
	// 검색용 필드 추가
    private String startDate;
    private String endDate;
    private String searchType;
    private String keyword;
    
    private List<AttachentsDTO> fileList;
}
