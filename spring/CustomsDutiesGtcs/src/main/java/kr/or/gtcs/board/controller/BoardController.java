package kr.or.gtcs.board.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import kr.or.gtcs.board.service.BoardService;
import kr.or.gtcs.dto.BoardDTO;
import kr.or.gtcs.security.auth.MemberDTOWrapper;

@RestController
@RequestMapping("/rest/board")
public class BoardController {
	
	@Autowired
	BoardService boardService;
	
	// 게시판 전체 조회
		@GetMapping("/list")
		public List<BoardDTO> findBoardList(
				@RequestParam String bdType,
				@RequestParam(required = false) String startDate,
				@RequestParam(required = false) String endDate,
				@RequestParam(required = false) String searchType,
				@RequestParam(required = false) String keyword) {
			
			BoardDTO board = new BoardDTO();
			board.setBdType(bdType);
			board.setBdDelyn("N");
			
			board.setStartDate(startDate);
			board.setEndDate(endDate);
			board.setSearchType(searchType);
			board.setKeyword(keyword);
			
			return boardService.findBoardList(board);
		}
		
	// 게시판 등록
	@PostMapping("/create")
	public String registerBoard(
			@ModelAttribute BoardDTO board,
			MultipartHttpServletRequest request,
			@AuthenticationPrincipal MemberDTOWrapper user
	) {
		String bdWriter = user.getRealUser().getMemName();
		Map<String, MultipartFile> fileMap = request.getFileMap();
		board.setBdWriter(bdWriter);
		int result = boardService.registerBoard(board, fileMap);
		
		if(result > 0) {
			return "success";
		}else {
			return "fail";
		}
	}	
	
	// 단건 상세 조회
	@GetMapping("/detail")
	public BoardDTO findBoard(@RequestParam("bdId") int bdId) {
		boardService.modifyViewCnt(bdId);
		BoardDTO board = boardService.findBoard(bdId);
		return board;	
	}
	
	// 게시판 수정
	@PutMapping("/modify")
	public String modifyBoard(
	    @RequestParam("bdId") int bdId,
	    @RequestParam("bdTitle") String bdTitle,
	    @RequestParam("bdCont") String bdCont,
	    MultipartHttpServletRequest request,
	    Authentication authentication
	) {
	    MemberDTOWrapper principal = (MemberDTOWrapper) authentication.getPrincipal();
	    String myName = principal.getRealUser().getMemName();
	    BoardDTO dbBoard = boardService.findBoard(bdId);
	    if (!myName.equals(dbBoard.getBdWriter())) return "N";

	    Map<String, MultipartFile> fileMap = request.getFileMap();

	    BoardDTO board = new BoardDTO();
	    board.setBdId(bdId);
	    board.setBdTitle(bdTitle);
	    board.setBdCont(bdCont);

	    int result = boardService.modifyBoard(board, fileMap);
	    return (result > 0) ? "Y" : "N";
	}
	
	// 게시판 삭제
	@DeleteMapping("/delete")
    public String modifyBoardDelete(@RequestParam int bdId, Authentication authentication) {
		MemberDTOWrapper principal = (MemberDTOWrapper) authentication.getPrincipal();
	    String myName = principal.getRealUser().getMemName();

	    BoardDTO dbBoard = boardService.findBoard(bdId);
	    String writerName = dbBoard.getBdWriter();

	    if (!myName.equals(writerName)) {
	        return "N";
	    }

	    BoardDTO board = new BoardDTO();
	    board.setBdId(bdId);
	    
	    int result = boardService.modifyBoardDelete(board);
	    return (result >0)? "Y": "N";
	}
	
	// 조회수 증가
	@PutMapping("/count")
	public String modifyViewCnt(@RequestParam int bdId) {
		int result = boardService.modifyViewCnt(bdId);
		return (result>0) ? "Y" : "N";
	}

}
