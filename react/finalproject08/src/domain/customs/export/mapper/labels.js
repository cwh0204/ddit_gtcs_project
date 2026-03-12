// src/domain/customs/export/mapper/labels.js

/**
 * Export 데이터 필드 라벨 정의
 * - UI에서 필드명을 표시할 때 사용
 * - 다국어 지원 시 이 파일을 수정
 */

export const FIELD_LABELS = {
  // ========== 기본 정보 ==========
  declarationId: "신고서 ID",
  declarationNumber: "신고번호",
  status: "상태 코드",
  statusLabel: "상태",
  statusBadgeVariant: "상태 뱃지",
  declarationDateFormatted: "신고일시",
  createdAtFormatted: "생성일시",
  updatedAtFormatted: "수정일시",
  isUrgent: "긴급 여부",

  // ========== AI 분석 정보 ==========
  aiAnalysis: {
    checkId: "AI 검사 ID",
    checkDate: "검사일자",
    riskLevel: "위험도 레벨",
    riskLevelLabel: "위험도",
    riskLevelColor: "위험도 색상",
    riskScore: "위험도 점수",
    docScore: "서류심사 점수",
    docComment: "서류 분석 의견",
    riskComment: "위험도 분석 의견",
  },

  // ========== 공통사항 ==========
  common: {
    declarationNumber: "신고번호",
    exporterName: "수출자 상호",
    exporterCode: "통관고유부호",
    exporterBusinessNumber: "사업자등록번호",
    exporterAddress: "주소",
    declarantName: "신고인 성명",
    buyerName: "구매자명",
    buyerIdNo: "구매자 ID",
    buyerAddress: "구매자 주소",
    dclType: "신고유형",
    transMode: "운송수단",
    exportKind: "수출종류",
    paymentMethod: "결제방법",
    incoterms: "인코텀즈",
    transportMode: "운송방식",
    containerMode: "컨테이너 방식",
    goodsType: "화물유형",
    refundApplicant: "환급신청인",
    destCountry: "목적국",
    loadingPort: "선적항",
    loadingLoc: "선적장소",
    goodsLoc: "화물소재지",
    cargoMgmtNo: "화물관리번호",
    bondedRepName: "보세구역 대표자",
    carrierName: "운송업체명",
    carrierCode: "운송업체 코드",
    vesselName: "선기명",
    containerNo: "컨테이너 번호",
    containerInd: "컨테이너 구분",
    bondedStartDate: "보세 시작일",
    bondedEndDate: "보세 종료일",
    departDate: "출항일",
    loadBondedArea: "적재보세구역",
  },

  // ========== 결제 정보 ==========
  payment: {
    exchangeRate: "환율",
    exchangeRateFormatted: "환율 (표시용)",
    currencyCode: "통화",
    paymentAmt: "결제금액",
    freightUSD: "운임료 (USD)",
    freightKRW: "운임료 (KRW)",
    insuranceUSD: "보험료 (USD)",
    insuranceKRW: "보험료 (KRW)",
    totalDeclAmt: "총신고금액",
    totalDeclAmtFormatted: "총신고금액 (표시용)",
  },

  // ========== 품목 정보 ==========
  items: {
    itemSequence: "품목 순번",
    hsCode: "HS코드",
    productName: "신고품명",
    tradeItemName: "거래품명",
    brandName: "상표명",
    modelName: "모델명",
    quantity: "수량",
    quantityFormatted: "수량 (표시용)",
    unit: "단위",
    totalWeight: "총중량",
    totalWeightFormatted: "총중량 (표시용)",
    totalPackCnt: "총포장개수",
    currency: "통화",
    unitPrice: "단가",
    unitPriceFormatted: "단가 (표시용)",
    totalPrice: "총금액",
    totalPriceFormatted: "총금액 (표시용)",
    invoiceSign: "인보이스 서명",
    attachYn: "첨부 여부",
    originCountry: "원산지",
    originCriteria: "원산지 기준",
    originMarkYn: "원산지표시 유무",
    originCertType: "원산지증명 유형",
  },

  // ========== 첨부파일 ==========
  essentialFiles: {
    invoice: "인보이스",
    packingList: "포장명세서",
    bl: "선하증권",
  },
  fileList: "첨부파일 목록",
};

export default FIELD_LABELS;
