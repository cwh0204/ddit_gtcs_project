package kr.or.gtcs.warehousestock.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import kr.or.gtcs.dto.MemberDTO;
import kr.or.gtcs.dto.WarehouseStockAreaDTO;
import kr.or.gtcs.dto.WarehouseStockDTO;

public interface WarehouseStockService {
	
	/**
	 * 컨테이너 입고를 처리하기 위한 서비스 메서드
	 * @param stock 컨테이너의 정보
	 */
	public void registerWarehouseStock(WarehouseStockDTO stock, MultipartFile warehouuseFile);
	
	/**
	 * 컨테이너 정보를 검색하기 위한 서비스 메서드
	 * @param stock contNumber 컨테이너 고유번호가 필요함
	 */
	public WarehouseStockDTO findLocateWarehouseStock(WarehouseStockDTO stock);
	
	/**
	 * @param stockNo 재고 id (Pk)
	 */
	public WarehouseStockDTO findDetailWarehouseStock(Integer stockNo);
	
	/**
	 * @return 컨테이너 리스트
	 */
	public List<WarehouseStockDTO> findListWarehouseStock(MemberDTO member);
	
	/**
	 * @param stock 변경될 컨테이너 정보 stockId 재고id(Pk) positionArea 보세 국내 구분  warehouseId 적재구역
	 */
	public void modifyLocateWarehouseStock(WarehouseStockDTO stock);
	
	/**
	 * @param stock stockId 재고id(Pk) delYn 출고상태 ex('Y', 'N')
	 */
	public void modifyOutboundWarehouseStock(WarehouseStockDTO stock);
	
	
	/**
	 * @param stock 구역 보세, 국내 구분
	 * @return
	 */
	public List<WarehouseStockAreaDTO> findListAreaCount(String positionArea);
	
	/**
	 * @param stock 변경되는 화물 입고 신고서 수정내용
	 */
	public void modifyWarehouseStock(WarehouseStockDTO stock);
}
