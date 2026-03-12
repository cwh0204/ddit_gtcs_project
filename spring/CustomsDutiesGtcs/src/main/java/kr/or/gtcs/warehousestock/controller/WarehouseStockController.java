package kr.or.gtcs.warehousestock.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.or.gtcs.dto.MemberDTO;
import kr.or.gtcs.dto.WarehouseHistoryDTO;
import kr.or.gtcs.dto.WarehouseStockAreaDTO;
import kr.or.gtcs.dto.WarehouseStockDTO;
import kr.or.gtcs.log.warehousestocklog.service.WarehouseStockLogService;
import kr.or.gtcs.security.auth.MemberDTOWrapper;
import kr.or.gtcs.warehousestock.service.WarehouseStockService;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*")
@RequestMapping("/rest/warehouse")
@RestController
@RequiredArgsConstructor
public class WarehouseStockController {
	private final WarehouseStockService service;
	private final WarehouseStockLogService logservice;
	
	/**
	 * 컨테이너 입고를 처리하기 위한 서비스 메서드
	 * @param stock 컨테이너의 정보
	 */
	@PostMapping
	public void registerWarehouseStock(
			@RequestPart("data") WarehouseStockDTO stock,
			@RequestPart(value = "warehouseFile", required = false) MultipartFile warehouseFile,
			@AuthenticationPrincipal MemberDTOWrapper member
	)
	{
		stock.setMemId(member.getRealUser().getMemId());
		service.registerWarehouseStock(stock,warehouseFile);
	}
	
	/**
	 * 컨테이너 정보를 검색하기 위한 서비스 메서드
	 * @param stock contNumber 컨테이너 고유번호가 필요함
	 */
	@GetMapping("/locate")
	public WarehouseStockDTO findLocateWarehouseStock(WarehouseStockDTO stock) {
	    return service.findLocateWarehouseStock(stock);
	}
	
	/**
	 * 컨테이너 상세 페이지 조회용 메서드
	 * @param stockNo 재고 id (Pk)
	 */
	@GetMapping("/{stockNo}")
	public WarehouseStockDTO findDetailWarehouseStock(
			@PathVariable("stockNo") Integer stockNo
	) 
	{
		return service.findDetailWarehouseStock(stockNo);
	}

	/**
	 * 컨테이너 리스트 조회용 메서드
	 * @return 컨테이너 리스트
	 */
	@GetMapping("/list")
	public List<WarehouseStockDTO> findListWarehouseStock(@AuthenticationPrincipal MemberDTOWrapper member){
		MemberDTO realMember = member.getRealUser();
		return service.findListWarehouseStock(realMember);
	}
	
	/**
	 * 컨테이너 위치 변경용 메서드
	 * @param stock 변경될 컨테이너 정보 stockId 재고id(Pk) positionArea 보세 국내 구분  warehouseId 적재구역
	 */
	@PutMapping("/locate")
	public void modifyLocateWarehouseStock(
			@RequestBody WarehouseStockDTO stock,
			@AuthenticationPrincipal MemberDTOWrapper member
			) {
		// 작업자 ID 주입 (로그용)
		stock.setMemId(member.getRealUser().getMemId());
		service.modifyLocateWarehouseStock(stock);
	}
	
	/**
	 * 출고처리리 상태변경을 위한 메서드
	 * @param stock 변경될 컨테이너 정보 stockId 식별자 , delYn 출고처리 상태정보 ex('Y','N')
	 */
	@PutMapping("/outbound")
	public void modifyOutboundWarehouseStock(
			@RequestBody WarehouseStockDTO stock,
			@AuthenticationPrincipal MemberDTOWrapper member
			) {
		// 작업자 ID 주입 (로그용)
		stock.setMemId(member.getRealUser().getMemId());
		service.modifyOutboundWarehouseStock(stock);
	}
	
	/**
	 * 창고 물건 보관 개수를 확인하기위한메서드
	 * @param positionArea
	 * @return 창고 영역별 카운트 리턴
	 */
	@GetMapping("/area/count/{positionArea}")
	public List<WarehouseStockAreaDTO> findListAreaCount(
			@PathVariable("positionArea") String positionArea
			){
		return service.findListAreaCount(positionArea);
	}
	
	/**
	 * 창고 입고 정보 수정용 메서드
	 * @param stock
	 */
	@PutMapping
	public void modifyWarehouseStock(
			@RequestBody WarehouseStockDTO stock
	) {
		System.out.println(stock);
		service.modifyWarehouseStock(stock);
	}
	
	/**

     * 특정 신고번호(화물)의 창고 처리 타임라인 히스토리 조회

     */

    @GetMapping("/history/{declNo}")
    public List<WarehouseHistoryDTO> getWarehouseHistory(
    		@PathVariable("declNo") String declNo
    		) {
        return logservice.findWarehouseLogList(declNo);

    }
	
}
