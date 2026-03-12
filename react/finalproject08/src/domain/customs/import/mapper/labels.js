// src/domain/customs/mapper/import/labels.js

/**
 * Import 데이터 필드 라벨 정의
 * - UI에서 필드명을 표시할 때 사용
 * - 다국어 지원 시 이 파일을 수정
 */

export const FIELD_LABELS = {
  // ========== 기본 정보 ==========
  declarationId: "신고서 ID",
  declarationNumber: "신고번호",
  statusCode: "상태 코드",
  statusLabel: "상태",
  statusBadgeVariant: "상태 뱃지",
  updatedAtFormatted: "수정일시",

  // ========== AI 분석 정보 ==========
  aiAnalysis: {
    checkId: "AI 검사 ID",
    checkDate: "검사일자",
    docNumber: "문서번호",

    riskLevel: "위험도 레벨",
    riskLevelLabel: "위험도",
    riskLevelColor: "위험도 색상",

    riskScore: "위험도 점수",
    riskScoreFormatted: "위험도 점수 (포맷)",
    riskScoreWithLabel: "위험도 점수 (라벨 포함)",
    riskScoreColor: "위험도 점수 색상",
    riskScoreLabel: "위험도 평가",
    riskComment: "위험도 분석 의견",

    docScore: "서류심사 점수",
    docScoreFormatted: "서류심사 점수 (포맷)",
    docScoreWithLabel: "서류심사 점수 (라벨 포함)",
    docScoreColor: "서류심사 점수 색상",
    docScoreLabel: "서류심사 평가",
    docComment: "서류 분석 의견",

    docScoreRange: "서류점수 구간 정보",
    docScoreDescription: "서류점수 상세 설명",
    needsOfficerAction: "세관원 액션 필요 여부",
    expectedAutoStatus: "예상 자동 상태",
    expectedAutoStatusLabel: "예상 자동 상태명",

    hsCodeMatch: "HS코드 일치 여부",
    priceMatch: "가격 일치 여부",
    originMatch: "원산지 일치 여부",
    weightMatch: "중량 일치 여부",
  },

  // ========== 감사 정보 ==========
  audit: {
    auditStatus: "심사 상태",
    processedBy: "처리자 ID",
    processedByName: "처리자명",
    processedDate: "처리일시",
    comment: "의견",
  },

  // ========== 공통사항 (거래당사자 정보) ==========
  common: {
    // 수입자
    importerTradeName: "수입자 상호",
    importerCode: "사업자등록번호",
    importerCustomsId: "통관고유부호",
    importerAddress: "주소",

    // 대리인
    repName: "대리인 성명",
    repTel: "전화번호",
    repTelExt: "내선번호",
    repEmail: "이메일",

    // 해외거래처
    overseasBizName: "해외거래처",
    overseasCountry: "거래처 국적",

    // 운송
    transMode: "운송수단",
    vesselName: "선기명",
    vesselNation: "선기국적",
    arrivalPort: "도착항",
    arrivalEstDate: "입항예정일",
    bondedInDate: "보세구역 반입일자",

    // 화물
    cargoMgmtNo: "화물관리번호",
    blNo: "B/L 번호",
    awbNo: "AWB 번호",

    // 기타
    importType: "수입종류",
    originCountry: "수입국",
    totalWeight: "총중량",
    totalWeightFormatted: "총중량 (표시용)",
    originCertYn: "원산지증명서 유무",
  },

  // ========== 가격신고 정보 ==========
  price: {
    writeDate: "신고일자",

    currency: "통화",
    payAmount: "결제금액",
    payAmountFormatted: "결제금액 (표시용)",

    invoiceNo: "인보이스 번호",
    invoiceDate: "인보이스 발행일",

    contractNo: "계약번호",
    contractDate: "계약일자",

    poNo: "구매주문서 번호",
    poDate: "구매주문일",

    incoterms: "인코텀즈",

    freightCurrency: "운임료 통화",
    freightAmt: "운임료",
    freightAmtFormatted: "운임료 (표시용)",

    insuranceCurrency: "보험료 통화",
    insuranceAmt: "보험료",
    insuranceAmtFormatted: "보험료 (표시용)",

    addAmtCurrency: "가산금액 통화",
    addAmt: "가산금액",
    addAmtFormatted: "가산금액 (표시용)",
  },

  // ========== 결제 정보 ==========
  paymentDetail: {
    contNo: "컨테이너 번호",
    totalWeight: "총중량",
    totalWeightFormatted: "총중량 (표시용)",
    netWeight: "순중량",
    netWeightFormatted: "순중량 (표시용)",
    containerList: "컨테이너 목록",
  },

  // ========== 세액 정보 ==========
  tax: {
    totalTaxBase: "총과세가격",
    totalTaxBaseFormatted: "총과세가격 (표시용)",

    totalDuty: "총관세",
    totalDutyFormatted: "총관세 (표시용)",

    totalVat: "총부가세",
    totalVatFormatted: "총부가세 (표시용)",

    totalTaxSum: "총세액합계",
    totalTaxSumFormatted: "총세액합계 (표시용)",
  },

  // ========== 물품 정보 ==========
  items: {
    itemId: "품목 ID",
    hsCode: "HS코드",
    productName: "신고품명",
    specification: "거래품명",
    modelName: "모델명",

    quantity: "수량",
    unit: "단위",
    unitPrice: "단가",
    unitPriceFormatted: "단가 (표시용)",

    totalPrice: "금액",
    totalAmount: "총금액",
    totalAmountFormatted: "총금액 (표시용)",

    netWeight: "순중량",
    netWeightFormatted: "순중량 (표시용)",

    taxBaseAmtItem: "과세가격",
    taxBaseAmtItemFormatted: "과세가격 (표시용)",

    originCountry: "원산지",
    originMarkYn: "원산지표시 유무",

    taxType: "관세구분",
    taxBaseType: "관세액 기준",
  },

  // ========== 첨부파일 ==========
  essentialFiles: {
    invoice: "인보이스",
    packingList: "포장명세서",
    bl: "선하증권",
  },
  fileList: "첨부파일 목록",
};

// 기본 export
export default FIELD_LABELS;
