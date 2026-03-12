// src/domain/warehouse/mapper/exportDeclarationConverter.js

/**
 * Export 신고서 변환 (상세 페이지용)
 * - exportMaster가 없어도 기본 구조 반환
 * - warehouse 테이블 기본 정보 활용
 */

import { formatDate, formatAmount, formatCurrency } from "../../../../utils/formatters";
import { STATUS_LABELS, STATUS_BADGE_VARIANTS } from "../../warehouseConstants";

export const mapWarehouseCargoToExportDeclaration = (cargo) => {
  if (!cargo) return null;

  const ex = cargo.exportMaster || {};
  const aiDocCheck = ex.aiDocCheck || null;

  const hasExportMaster = !!(
    cargo.exportMaster &&
    cargo.exportMaster.exportId &&
    String(cargo.exportMaster.exportId).trim() !== "" &&
    String(cargo.exportMaster.exportId).toLowerCase() !== "null"
  );

  return {
    declarationId: ex.exportId || null,
    declarationNumber: ex.exportNumber || cargo.declNo || "-",
    status: ex.status || "STORED",
    statusLabel: STATUS_LABELS[ex.status] || STATUS_LABELS["STORED"] || "보관중",
    statusBadgeVariant: STATUS_BADGE_VARIANTS[ex.status] || "outline",
    isUrgent: false,
    declarationDateFormatted: formatDate(ex.submitDate || ex.regDate || cargo.entryDate),
    createdAtFormatted: formatDate(ex.regDate || cargo.entryDate),
    updatedAtFormatted: formatDate(ex.regDate || cargo.entryDate),

    aiAnalysis: aiDocCheck
      ? {
          checkId: aiDocCheck.checkId || null,
          checkDate: formatDate(aiDocCheck.checkDate) || "-",
          riskLevel: aiDocCheck.riskResult === "RED" ? "RED" : "GREEN",
          riskLevelLabel: aiDocCheck.riskResult === "RED" ? "Red" : "Green",
          riskLevelColor: aiDocCheck.riskResult === "RED" ? "danger" : "success",
          riskScore: aiDocCheck.riskScore || 0,
          docScore: aiDocCheck.docScore || 0,
          docComment: aiDocCheck.docComment || "AI 분석 정보 없음",
          riskComment: aiDocCheck.riskComment || "위험도 분석 정보 없음",
          needsOfficerAction: aiDocCheck.docScore >= 85 && aiDocCheck.docScore <= 94,
        }
      : null,

    common: {
      declarationNumber: ex.exportNumber || cargo.declNo || "-",
      exporterName: ex.exporterName || ex.repName || cargo.repName || "-",
      exporterCode: ex.customsId || "-",
      exporterBusinessNumber: ex.bizRegNo || "-",
      exporterAddress: ex.goodsLoc || "-",
      declarantName: ex.repName || cargo.repName || "-",
      buyerName: ex.buyerName || "-",
      buyerIdNo: ex.buyerIdNo || "-",
      buyerAddress: ex.buyerAddress || "-",
      dclType: ex.dclType || null,
      transMode: ex.transMode || null,
      exportKind: ex.exportKind || null,
      paymentMethod: ex.paymentMethod || null,
      incoterms: ex.incoterms || null,
      transportMode: ex.transportMode || null,
      containerMode: ex.containerMode || null,
      goodsType: ex.goodsType || null,
      refundApplicant: ex.refundApplicant || null,
      destCountry: ex.destCountry || "-",
      loadingPort: ex.loadingPort || "-",
      loadingLoc: ex.loadingLoc || "-",
      goodsLoc: ex.goodsLoc || "-",
      cargoMgmtNo: ex.cargoMgmtNo || "-",
      bondedRepName: ex.bondedRepName || "-",
      carrierName: ex.carrierName || "-",
      vesselName: ex.vesselName || "-",
      containerNo: ex.contNo || cargo.contNumber || "-",
      containerInd: ex.containerMode === "FCL" ? "Y" : "N",
    },

    payment: {
      exchangeRate: ex.exchangeRate || 0,
      exchangeRateFormatted: formatAmount(ex.exchangeRate || 0) + " " + (ex.currencyCode || "USD"),
      currencyCode: ex.currencyCode || "USD",
      paymentAmt: ex.payAmount ? `${ex.currencyCode || "USD"} ${Number(ex.payAmount).toLocaleString()}` : "-",
      freightUSD: formatCurrency(ex.freightAmt || 0, ex.currencyCode || "USD"),
      freightKRW: formatCurrency((ex.freightAmt || 0) * (ex.exchangeRate || 1), "KRW"),
      insuranceUSD: formatCurrency(ex.insuranceAmt || 0, ex.currencyCode || "USD"),
      insuranceKRW: formatCurrency((ex.insuranceAmt || 0) * (ex.exchangeRate || 1), "KRW"),
      totalDeclAmt: ex.totalDeclAmt || 0,
      totalDeclAmtFormatted: formatCurrency(ex.totalDeclAmt || 0, "KRW"),
    },

    items: [
      {
        itemSequence: 1,
        hsCode: ex.hsCode || "-",
        productName: ex.itemNameDeclared || cargo.itemName || "-",
        tradeItemName: ex.itemNameTrade || "-",
        brandName: ex.brandName || "-",
        modelName: ex.modelName || "-",
        quantity: ex.qty || cargo.qty || 0,
        quantityFormatted: formatAmount(ex.qty || cargo.qty || 0),
        unit: ex.qtyUnit || "-",
        totalWeight: ex.totalWeight || cargo.grossWeight || 0,
        totalWeightFormatted: formatAmount(ex.totalWeight || cargo.grossWeight || 0) + " KG",
        totalPackCnt: ex.totalPackCnt || 0,
        currency: ex.currencyCode || "USD",
        unitPrice: ex.unitPrice || 0,
        unitPriceFormatted: formatCurrency(ex.unitPrice || 0, ex.currencyCode || "USD"),
        totalPrice: ex.totalDeclAmt || 0,
        totalPriceFormatted: formatCurrency(ex.totalDeclAmt || 0, "KRW"),
        invoiceSign: ex.invoiceSign || "-",
        attachYn: ex.attachYn || "N",
        originCountry: ex.originCountry || "KR",
        originCriteria: ex.originCriteria || null,
        originMarkYn: ex.originMarkYn || null,
        originCertType: ex.originCertType || null,
      },
    ],

    essentialFiles: {
      invoice: cargo.fileList?.find((f) => f.fileType === "INVOICE" || f.fileType === "invoice") || null,
      packingList: cargo.fileList?.find((f) => f.fileType === "PACKING" || f.fileType === "packinglist") || null,
      bl: cargo.fileList?.find((f) => f.fileType === "BL" || f.fileType === "bl") || null,
    },

    fileList:
      cargo.fileList?.filter(
        (f) =>
          f.fileType !== "INVOICE" &&
          f.fileType !== "invoice" &&
          f.fileType !== "PACKING" &&
          f.fileType !== "packinglist" &&
          f.fileType !== "BL" &&
          f.fileType !== "bl" &&
          f.fileType !== "WAREHOUSE_ENTRY" &&
          f.fileType !== "warehouse_entry",
      ) || [],

    _raw: ex,
    _hasExportMaster: hasExportMaster,
    _needsAIFetch: hasExportMaster && !!ex.exportId && !aiDocCheck,
  };
};
