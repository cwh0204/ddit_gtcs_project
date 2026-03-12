/**
 * src/domain/customs/tax/taxMapper.js
 * 📌 세액/납부 관리 데이터 변환 Mapper
 */

import { PAYMENT_STATUS_LABELS, PAYMENT_STATUS_BADGE_VARIANTS } from "./taxConstants";

import { formatDate, formatDateOnly, formatCurrency } from "../../../utils/formatters";

/**
 * 납부 상태 계산 (Application 로직)
 * DB: UNPAID/PAID → Application: 더 세분화
 */
const calculatePaymentStatus = (data) => {
  //납부 완료
  if (data.payStatus === "PAID" || data.payDate) {
    return "PAYMENT_COMPLETED";
  }

  //고지서 발송되지 않음
  if (!data.issueDate) {
    return "UNPAID";
  }

  //고지서 발송됨
  if (data.issueDate && !data.payDate) {
    const now = new Date();
    const dueDate = new Date(data.dueDate);

    // 납부 기한 초과
    if (now > dueDate) {
      return "PAYMENT_OVERDUE";
    }

    // 납부 대기
    return "PAYMENT_PENDING";
  }

  return "UNPAID";
};

//GET - 목록 조회용

export const mapTaxPaymentListFromAPI = (data) => {
  if (!data) {
    console.error("[mapTaxPaymentListFromAPI] data가 null");
    return null;
  }

  //Application 레벨 상태 계산
  const status = calculatePaymentStatus(data);

  return {
    // ========== 기본 정보 ==========
    paymentId: data.payId, // DB: PAY_ID
    importId: data.importId, // DB: IMPORT_ID
    declarationNumber: data.importNumber || data.importId, // Application

    // ========== 상태 ==========
    status: status, // Application 계산
    statusLabel: PAYMENT_STATUS_LABELS[status] || status,
    statusBadgeVariant: PAYMENT_STATUS_BADGE_VARIANTS[status] || "default",
    dbStatus: data.payStatus, // DB 원본 (UNPAID/PAID)

    // ========== 납부자 정보 ==========
    memId: data.memId, // DB: MEM_ID
    regNo: data.regNo, // DB: REG_NO
    importerName: data.importerName || "-", // JOIN 데이터

    // ========== 세액 정보 ==========
    payAmount: data.payAmt || 0, // DB: PAY_AMT
    payAmountFormatted: formatCurrency(data.payAmt, "KRW"),
    supplyAmount: data.suplplyAmt || 0, // DB: SUPLPLY_AMT (오타 주의!)
    supplyAmountFormatted: formatCurrency(data.suplplyAmt, "KRW"),

    // ========== 고지서 정보 ==========
    issueDate: data.issueDate, // DB: ISSUE_DATE
    issueDateFormatted: formatDateOnly(data.issueDate),
    dueDate: data.dueDate, // DB: DUE_DATE
    dueDateFormatted: formatDateOnly(data.dueDate),
    bankName: data.bankName || "-", // DB: BANK_NAME
    virtualAccount: data.virtualAcco || "-", // DB: VIRTUAL_ACCO

    // ========== 납부 정보 ==========
    payDate: data.payDate, // DB: PAY_DATE
    payDateFormatted: data.payDate ? formatDate(data.payDate) : "-",

    // ========== 세액 산출 정보 ==========
    quantity: data.qty || 0, // DB: QTY
    price: data.price || 0, // DB: PRICE
    priceFormatted: formatCurrency(data.price, "KRW"),
    exchangeRate: data.rate || 0, // DB: RATE
    basicTaxRate: data.basicTaxRate || 0, // DB: BASIC_TAX_RATE

    // ========== 원본 데이터 ==========
    _raw: data,
  };
};

/**
 * 목록 배열 변환
 */
export const mapTaxPaymentList = (dataList) => {
  if (!Array.isArray(dataList)) {
    console.error("[mapTaxPaymentList] dataList가 배열이 아님", dataList);
    return [];
  }

  return dataList
    .map((data) => {
      try {
        return mapTaxPaymentListFromAPI(data);
      } catch (error) {
        console.error("[mapTaxPaymentList] 변환 에러:", error, data);
        return null;
      }
    })
    .filter((item) => item !== null);
};

//GET - 상세 조회용
export const mapTaxPaymentDetailFromAPI = (data) => {
  if (!data) {
    console.error("[mapTaxPaymentDetailFromAPI] data가 null");
    return null;
  }

  const status = calculatePaymentStatus(data);

  return {
    // ========== 최상위 기본 정보 ==========
    paymentId: data.payId,
    importId: data.importId,
    status: status,
    statusLabel: PAYMENT_STATUS_LABELS[status] || status,
    statusBadgeVariant: PAYMENT_STATUS_BADGE_VARIANTS[status] || "default",

    //payer: 납부자 정보
    payer: {
      memId: data.memId,
      regNo: data.regNo,
      importerName: data.importerName || "-",
    },

    //payment: 납부 정보
    payment: {
      payAmount: data.payAmt || 0,
      payAmountFormatted: formatCurrency(data.payAmt, "KRW"),
      issueDate: data.issueDate,
      issueDateFormatted: formatDateOnly(data.issueDate),
      dueDate: data.dueDate,
      dueDateFormatted: formatDateOnly(data.dueDate),
      bankName: data.bankName || "-",
      virtualAccount: data.virtualAcco || "-",
      payDate: data.payDate,
      payDateFormatted: data.payDate ? formatDate(data.payDate) : "-",
    },

    //tax: 세액 상세
    tax: {
      supplyAmount: data.suplplyAmt || 0,
      supplyAmountFormatted: formatCurrency(data.suplplyAmt, "KRW"),
      quantity: data.qty || 0,
      price: data.price || 0,
      priceFormatted: formatCurrency(data.price, "KRW"),
      exchangeRate: data.rate || 0,
      basicTaxRate: data.basicTaxRate || 0,
      billDetail: data.billDetail || null, // CLOB
    },

    // ========== 원본 데이터 ==========
    _raw: data,
  };
};

//집계 함수들
/**
 * 상태별 건수 계산
 */
export const calculatePaymentStatusCounts = (dataList) => {
  if (!Array.isArray(dataList)) return { total: 0 };

  const counts = {
    total: dataList.length,
    UNPAID: 0,
    NOTICE_ISSUED: 0,
    PAYMENT_PENDING: 0,
    PAYMENT_OVERDUE: 0,
    PAYMENT_COMPLETED: 0,
  };

  dataList.forEach((item) => {
    const status = calculatePaymentStatus(item);
    if (counts.hasOwnProperty(status)) {
      counts[status]++;
    }
  });

  return counts;
};

/**
 * 총 납부액 계산
 */
export const calculateTotalPaymentAmount = (dataList) => {
  if (!Array.isArray(dataList)) return 0;
  return dataList.reduce((sum, item) => sum + (item.payAmt || 0), 0);
};

/**
 * 미납액 계산
 */
export const calculateUnpaidAmount = (dataList) => {
  if (!Array.isArray(dataList)) return 0;
  return dataList.filter((item) => item.payStatus === "UNPAID" && !item.payDate).reduce((sum, item) => sum + (item.payAmt || 0), 0);
};

export default {
  mapTaxPaymentListFromAPI,
  mapTaxPaymentList,
  mapTaxPaymentDetailFromAPI,
  calculatePaymentStatusCounts,
  calculateTotalPaymentAmount,
  calculateUnpaidAmount,
};
