// src/domain/customs/export/mapper/converters.js

/**
 * Export 신고서 데이터 변환 Mapper
 * DB Flat 구조 → UI 중첩 구조 변환
 * ✅ statusCode 추가 (RELEASE_APPROVED 버튼 표시 버그 수정)
 */

import {
  STATUS_LABELS,
  STATUS_BADGE_VARIANTS,
  CHANNEL_LABELS,
  CHANNEL_COLORS,
  RISK_LABELS,
  RISK_COLORS,
  RISK_LEVELS,
  normalizeBackendStatus,
} from "../exportConstants";

import { formatDate, formatAmount, formatCurrency } from "../../../../utils/formatters";

/**
 * 위험도 레벨 매핑 헬퍼
 */
const mapRiskLevel = (level, score) => {
  if (level && (level === "HIGH" || level === "RED")) return RISK_LEVELS.RED;
  if (typeof score === "number" && score < 80) return RISK_LEVELS.RED;
  return RISK_LEVELS.GREEN;
};

/**
 * 목록 조회용 - 단일 항목 변환
 * ✅ aiDocCheck 중첩 구조 처리
 */
export const mapExportDeclarationListFromAPI = (data) => {
  if (!data) {
    console.error("[mapExportDeclarationListFromAPI] data가 null");
    return null;
  }

  const normalizedStatus = normalizeBackendStatus(data.status);

  // ✅ aiDocCheck 중첩 구조 처리
  const aiDocCheck = data.aiDocCheck || {};
  const docScore = aiDocCheck.docScore != null ? aiDocCheck.docScore : data.docScore != null ? data.docScore : 0;
  const riskScore = aiDocCheck.riskScore != null ? aiDocCheck.riskScore : data.riskScore != null ? data.riskScore : 0;
  const riskResult = aiDocCheck.riskResult || data.riskResult || null;

  return {
    declarationId: data.exportId,
    declarationNumber: data.exportNumber,
    declarationDate: formatDate(data.submitDate || data.regDate),
    declarationDateRaw: data.submitDate || data.regDate,
    status: normalizedStatus,
    statusCode: normalizedStatus, // ✅ 추가
    statusLabel: STATUS_LABELS[normalizedStatus] || normalizedStatus,
    statusBadgeVariant: STATUS_BADGE_VARIANTS[normalizedStatus] || "default",

    exporterName: data.exporterName || data.repName || "-",
    exporterBusinessNumber: data.bizRegNo || "-",
    declarantName: data.repName || "-",

    itemName: data.itemNameDeclared || "-",
    totalAmount: data.totalDeclAmt || 0,
    totalAmountFormatted: formatCurrency(data.totalDeclAmt, "KRW"),

    assignedOfficer: data.member?.memName || "-",
    assignedOfficerId: data.officerId || null,

    isUrgent: data.isUrgent === true || data.isUrgent === "Y",
    urgentLabel: data.isUrgent === true || data.isUrgent === "Y" ? "긴급" : "",

    aiScore: docScore,
    docScore: docScore,
    riskScore: riskScore,
    riskLevel: mapRiskLevel(riskResult, docScore),
    riskLevelLabel: RISK_LABELS[mapRiskLevel(riskResult, docScore)] || "Green",
    riskLevelColor: RISK_COLORS[mapRiskLevel(riskResult, docScore)] || "success",

    channelType: data.channelType || "GREEN",
    channelTypeLabel: CHANNEL_LABELS[data.channelType] || "-",
    channelTypeColor: CHANNEL_COLORS[data.channelType] || "default",
    _raw: data,
  };
};

/**
 * 목록 조회용 - 배열 변환
 */
export const mapExportDeclarationList = (dataList) => {
  if (!Array.isArray(dataList)) {
    console.error("[mapExportDeclarationList] dataList가 배열이 아님", dataList);
    return [];
  }

  return dataList
    .map((data) => {
      try {
        return mapExportDeclarationListFromAPI(data);
      } catch (error) {
        console.error("[mapExportDeclarationList] 변환 에러:", error, data);
        return null;
      }
    })
    .filter((item) => item !== null);
};

/**
 * 상세 조회용 - 중첩 구조 변환
 * ✅ statusCode 추가 (핵심 버그 수정)
 * ✅ aiDocCheck 중첩 구조 처리
 * ✅ needsOfficerAction 추가
 */
export const mapExportDeclarationDetailFromAPI = (data) => {
  if (!data) {
    console.error("[mapExportDeclarationDetailFromAPI] data가 null");
    return null;
  }

  const normalizedStatus = normalizeBackendStatus(data.status);

  // ✅ aiDocCheck 중첩 구조 처리
  const aiDocCheck = data.aiDocCheck || {};
  const docScore = aiDocCheck.docScore != null ? aiDocCheck.docScore : data.docScore != null ? data.docScore : 0;
  const riskScore = aiDocCheck.riskScore != null ? aiDocCheck.riskScore : data.riskScore != null ? data.riskScore : 0;
  const riskResult = aiDocCheck.riskResult || data.riskResult || null;
  const checkDate = aiDocCheck.checkDate || data.checkDate || null;
  const docComment = aiDocCheck.docComment || data.docComment || "서류 분석 결과가 없습니다.";
  const riskComment = aiDocCheck.riskComment || data.riskComment || "위험도 분석 결과가 없습니다.";
  const checkId = aiDocCheck.checkId || data.checkId || null;

  const detailRiskLevel = riskResult === "RED" ? RISK_LEVELS.RED : RISK_LEVELS.GREEN;

  return {
    declarationId: data.exportId,
    declarationNumber: data.exportNumber,
    status: normalizedStatus,
    statusCode: normalizedStatus, // ✅ 핵심 수정 - 이 필드가 없어서 RELEASE_APPROVED 버튼이 안 나왔음
    statusLabel: STATUS_LABELS[normalizedStatus] || normalizedStatus,
    statusBadgeVariant: STATUS_BADGE_VARIANTS[normalizedStatus] || "default",
    isUrgent: data.isUrgent === true || data.isUrgent === "Y",
    declarationDateFormatted: formatDate(data.submitDate || data.regDate),
    createdAtFormatted: formatDate(data.regDate),
    updatedAtFormatted: formatDate(data.regDate),

    // ✅ AI 분석 정보
    aiAnalysis: {
      checkId: checkId,
      checkDate: checkDate ? formatDate(checkDate) : "-",
      riskLevel: detailRiskLevel,
      riskLevelLabel: RISK_LABELS[detailRiskLevel] || "Green",
      riskLevelColor: RISK_COLORS[detailRiskLevel] || "success",
      riskScore: riskScore,
      docScore: docScore,
      docComment: docComment,
      riskComment: riskComment,
      needsOfficerAction: docScore >= 85 && docScore <= 94,
    },

    // 공통 정보
    common: {
      declarationNumber: data.exportNumber || "-",
      exporterName: data.exporterName || data.repName || "-",
      exporterCode: data.customsId || "-",
      exporterBusinessNumber: data.bizRegNo || "-",
      exporterAddress: data.goodsLoc || "-",
      declarantName: data.repName || "-",
      buyerName: data.buyerName || "-",
      buyerIdNo: data.buyerIdNo || "-",
      buyerAddress: data.buyerAddress || "-",
      dclType: data.dclType || null,
      transMode: data.transMode || null,
      exportKind: data.exportKind || null,
      paymentMethod: data.paymentMethod || null,
      incoterms: data.incoterms || null,
      transportMode: data.transportMode || null,
      containerMode: data.containerMode || null,
      goodsType: data.goodsType || null,
      refundApplicant: data.refundApplicant || null,
      destCountry: data.destCountry || "-",
      loadingPort: data.loadingPort || "-",
      loadingLoc: data.loadingLoc || "-",
      goodsLoc: data.goodsLoc || "-",
      cargoMgmtNo: data.cargoMgmtNo || "-",
      bondedRepName: data.bondedRepName || "-",
      carrierName: data.carrierName || "-",
      carrierCode: data.carrierCode || "-",
      vesselName: data.vesselName || "-",
      containerNo: data.contNo || "-",
      containerInd: data.containerMode === "FCL" ? "Y" : "N",
      bondedStartDate: null,
      bondedEndDate: null,
      departDate: null,
      loadBondedArea: data.loadingLoc || "-",
    },

    // 결제 정보
    payment: {
      exchangeRate: data.exchangeRate || 0,
      exchangeRateFormatted: formatAmount(data.exchangeRate) + " " + (data.currencyCode || "USD"),
      currencyCode: data.currencyCode || "USD",
      paymentAmt: data.payAmount ? `${data.currencyCode || "USD"} ${Number(data.payAmount).toLocaleString()}` : "-",
      freightUSD: formatCurrency(data.freightAmt, data.currencyCode || "USD"),
      freightKRW: formatCurrency(data.freightAmt * (data.exchangeRate || 1), "KRW"),
      insuranceUSD: formatCurrency(data.insuranceAmt, data.currencyCode || "USD"),
      insuranceKRW: formatCurrency(data.insuranceAmt * (data.exchangeRate || 1), "KRW"),
      totalDeclAmt: data.totalDeclAmt || 0,
      totalDeclAmtFormatted: formatCurrency(data.totalDeclAmt, "KRW"),
    },

    // 품목 정보
    items: [
      {
        itemSequence: 1,
        hsCode: data.hsCode || "-",
        productName: data.itemNameDeclared || data.itemNameKr || "-",
        tradeItemName: data.itemNameTrade || "-",
        brandName: data.brandName || "-",
        modelName: data.modelName || "-",
        quantity: data.qty || 0,
        quantityFormatted: formatAmount(data.qty),
        unit: data.qtyUnit || "-",
        totalWeight: data.totalWeight || 0,
        totalWeightFormatted: formatAmount(data.totalWeight) + " KG",
        totalPackCnt: data.totalPackCnt || 0,
        currency: data.currencyCode || "USD",
        unitPrice: data.unitPrice || 0,
        unitPriceFormatted: formatCurrency(data.unitPrice, data.currencyCode || "USD"),
        totalPrice: data.totalDeclAmt || 0,
        totalPriceFormatted: formatCurrency(data.totalDeclAmt, "KRW"),
        invoiceSign: data.invoiceSign || null,
        attachYn: data.attachYn || "N",
        originCountry: data.originCountry || "KR",
        originCriteria: data.originCriteria || null,
        originMarkYn: data.originMarkYn || null,
        originCertType: data.originCertType || null,
      },
    ],

    // 첨부파일 변환
    essentialFiles: (() => {
      const findFile = (fileType) => {
        const file = data.fileList?.find((f) => f.fileType === fileType);
        if (!file) return null;
        return {
          fileId: file.fileId,
          name: file.fileName,
          fileName: file.fileName,
          uploadDate: formatDate(file.uploadDate),
          fileType: file.fileType,
          status: "등록",
        };
      };

      return {
        invoice: findFile("invoice"),
        packingList: findFile("packinglist"),
        bl: findFile("bl"),
      };
    })(),

    // 기타 첨부파일
    fileList:
      data.fileList
        ?.filter((f) => f.fileType === "other")
        .map((file, index) => ({
          no: index + 1,
          fileId: file.fileId,
          name: file.fileName,
          fileName: file.fileName,
          fileType: file.fileType,
          type: "기타",
          uploadDate: formatDate(file.uploadDate),
          status: "등록",
        })) || [],

    _raw: data,
  };
};

/**
 * API 전송용 변환 (UI → DTO)
 */
export const mapExportDeclarationToAPI = (uiData) => {
  return {};
};
