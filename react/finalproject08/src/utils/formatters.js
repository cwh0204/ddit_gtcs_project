/**
 * src/utils/formatters.js
 * 날짜 + 시간 포맷 (YYYY. MM. DD. 오전/오후 HH:mm)
 * - Oracle Date 문자열 호환
 */
export const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";

    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24시간제 (필요시 true로 변경)
    });
  } catch (error) {
    console.warn("[formatters.formatDate] 날짜 변환 실패:", dateString);
    return "-";
  }
};

/**
 * 날짜만 포맷 (YYYY. MM. DD.)
 * - 기존 mapper의 formatDate 로직 적용
 */
export const formatDateOnly = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (error) {
    console.warn("[formatters.formatDateOnly] 날짜 변환 실패:", dateString);
    return "-";
  }
};

/**
 * 금액 포맷 (천단위 쉼표)
 * - null/undefined 방어 로직 포함
 */
export const formatAmount = (amount) => {
  if (amount === null || amount === undefined || amount === "") return "-";
  const num = Number(amount);
  if (isNaN(num)) return "-";
  return new Intl.NumberFormat("ko-KR").format(num);
};

/**
 * 통화 포맷 (통화코드 + 금액)
 * - 예: "USD 1,200", "1,200원"
 */
export const formatCurrency = (amount, currency = "KRW") => {
  if (amount === null || amount === undefined || amount === "") return "-";
  const num = Number(amount);
  if (isNaN(num)) return "-";

  const formatted = formatAmount(num);

  if (currency === "KRW") {
    return `${formatted}원`;
  }
  return `${currency} ${formatted}`;
};

//파일 크기 포맷

export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "-";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
};

//퍼센트 포맷

export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined) return "-";
  const num = Number(value);
  if (isNaN(num)) return "-";
  return `${num.toFixed(decimals)}%`;
};

//중량 포맷
export const formatWeight = (weight, unit = "KG") => {
  if (weight === null || weight === undefined) return "-";
  const num = Number(weight);
  if (isNaN(num)) return "-";
  return `${formatAmount(num)} ${unit}`;
};

//전화번호 포맷
export const formatPhone = (phone) => {
  if (!phone) return "-";
  const cleaned = phone.replace(/[^0-9]/g, "");

  if (cleaned.length < 9) return phone;

  // 서울 (02)
  if (cleaned.startsWith("02")) {
    return cleaned.replace(/(\d{2})(\d{3,4})(\d{4})/, "$1-$2-$3");
  }
  // 그 외 지역/휴대폰
  return cleaned.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
};

//사업자등록번호 포맷

export const formatBizNo = (bizNo) => {
  if (!bizNo) return "-";
  const cleaned = bizNo.replace(/[^0-9]/g, "");
  if (cleaned.length !== 10) return bizNo;
  return cleaned.replace(/(\d{3})(\d{2})(\d{5})/, "$1-$2-$3");
};

// Default Export
export default {
  formatDate,
  formatDateOnly,
  formatAmount,
  formatCurrency,
  formatFileSize,
  formatPercent,
  formatWeight,
  formatPhone,
  formatBizNo,
};
