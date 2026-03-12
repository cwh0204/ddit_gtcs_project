package kr.or.gtcs.warehousestock.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import kr.or.gtcs.attachents.service.AttachentsService;
import kr.or.gtcs.commons.exception.SystemFailureException;
import kr.or.gtcs.dto.MemberDTO;
import kr.or.gtcs.dto.WarehouseStockAreaDTO;
import kr.or.gtcs.dto.WarehouseStockDTO;
import kr.or.gtcs.log.warehousestocklog.service.WarehouseStockLogService;
import kr.or.gtcs.warehousestock.mapper.WarehouseStockMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WarehouseStockServiceImpl implements WarehouseStockService {
	
	private final WarehouseStockMapper stockMapper;
	private final WarehouseStockLogService logService;
	private final AttachentsService attService;
	
	/**
	 * 컨테이너 입고 및 파일 업로드 처리
	 * @param stock          입고할 컨테이너 정보
	 * @param warehouuseFile   첨부 파일
	 * @throws SystemFailureException 입고 처리 중 DB 또는 파일 업로드 오류 발생 시
	 */
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void registerWarehouseStock(WarehouseStockDTO stock, MultipartFile warehouuseFile) {
		
		try {			
			stockMapper.insertWarehouseStock(stock);
			Map<String, MultipartFile> files = new HashMap<>();
			files.put("warehouse", warehouuseFile);
			attService.uploadMultipleFiles(stock.getContNo(), "warehouse", files);
			logService.registerLog(stock, "IMP_RPT");
		}catch (Exception e) {
			throw new SystemFailureException("시스템 오류가 발생했습니다 관리자에게 문의하세요");
		}

	}
	
	/**
	 * 컨테이너 고유번호(ContNo)를 이용한 위치 및 재고 정보 조회
	 * @param stock 컨테이너 번호(contNo)가 포함된 DTO
	 * @return 해당 컨테이너의 재고 정보
	 * @throws SystemFailureException 조회 중 시스템 오류 발생 시
	 */
	@Override
	public WarehouseStockDTO findLocateWarehouseStock(WarehouseStockDTO stock) {
		try {			
			return stockMapper.selectLocateWarehouseStock(stock);
		}catch (Exception e) {
			throw new SystemFailureException("시스템 오류가 발생했습니다 관리자에게 문의하세요");
		}
	}
	
	/**
	 * 재고 고유 ID(PK)를 이용한 상세 재고 정보 조회
	 * @param stockNo 재고 고유 ID (PK)
	 * @return 상세 재고 정보 DTO
	 * @throws SystemFailureException 조회 중 시스템 오류 발생 시
	 */
	@Override
	public WarehouseStockDTO findDetailWarehouseStock(Integer stockNo) {
		try {			
			return stockMapper.selectDetailWarehouseStock(stockNo);
		}catch (Exception e) {
			throw new SystemFailureException("시스템 오류가 발생했습니다 관리자에게 문의하세요");
		}
	}
	
	/**
	 * 전체 창고 재고 목록 조회
	 * @return 전체 컨테이너 재고 리스트
	 * @throws SystemFailureException 목록 조회 중 시스템 오류 발생 시
	 */
	@Override
	public List<WarehouseStockDTO> findListWarehouseStock(MemberDTO member) {
		try {			
			return stockMapper.selectListWarehouseStock(member);
		}catch (Exception e) {
			e.printStackTrace();
			throw new SystemFailureException("시스템 오류가 발생했습니다 관리자에게 문의하세요");
		}
	}
	
	/**
	 * 컨테이너의 적재 위치 변경 (구역 및 보세/국내 구분 수정)
	 * @param stock 변경할 정보 (stockId, positionArea, warehouseId 등)
	 * @throws SystemFailureException 위치 수정 및 로그 기록 중 오류 발생 시
	 */
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void modifyLocateWarehouseStock(WarehouseStockDTO stock) {
		try {			
			stockMapper.updateLocateWarehouseStock(stock);
			WarehouseStockDTO updatedStock = stockMapper.selectDetailWarehouseStock(stock.getStockId());
			updatedStock.setMemId(stock.getMemId());
			logService.registerLog(updatedStock, "LOC_MOD");
		}catch (Exception e) {
			throw new SystemFailureException("시스템 오류가 발생했습니다 관리자에게 문의하세요");
		}
	}
	
	/**
	 * 컨테이너 출고 처리 (출고 상태값 변경)
	 * @param stock 출고 처리 정보 (stockId, delYn 등)
	 * @throws SystemFailureException 출고 상태 업데이트 중 오류 발생 시
	 */
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void modifyOutboundWarehouseStock(WarehouseStockDTO stock) {
		try {			
			stockMapper.updateOutboundWarehouseStock(stock);
			WarehouseStockDTO updatedStock = stockMapper.selectDetailWarehouseStock(stock.getStockId());
			updatedStock.setMemId(stock.getMemId());
			logService.registerLog(updatedStock, "OUTBOUND");
		}catch (Exception e) {
			throw new SystemFailureException("시스템 오류가 발생했습니다 관리자에게 문의하세요");
		}
	}

	/**
	 *	컨테이너 구역 통계
	 *	@param stock 보세 국내 구분 positionArea
	 *	@throws SystemFailureException 구역통계 불러오기 오류 발생 시
	 */
	@Override
	public List<WarehouseStockAreaDTO> findListAreaCount(String positionArea) {
		try {
			return stockMapper.selectWarehouseStockAreaCount(positionArea);
		}catch (Exception e) {
			e.printStackTrace();
			throw new SystemFailureException("시스템 오류가 발생했습니다 관리자에게 문의하세요");
		}
	}

	/**
	 *	화물 입고등록 정보 수정
	 *  @param stock 신고서 정보수정 내용
	 *  @throws SystemFailureException 신고서 정보 수정 오류 방생 시
	 */
	@Override
	public void modifyWarehouseStock(WarehouseStockDTO stock) {
		try {
			stockMapper.updateWarehouseStock(stock);
		}catch (Exception e) {
			e.printStackTrace();
			throw new SystemFailureException("시스템 오류가 발생했습니다 관리자에게 문의하세요");
		}
		
	}

}
