// src/domain/warehouse/mapper/importDeclarationConverter.js

/**
 * Import 신고서 변환 (상세 페이지용)
 * - importMaster가 없어도 기본 구조 반환
 * - warehouse 테이블 기본 정보 활용
 */

import { formatDate, formatAmount, formatCurrency } from "../../../../utils/formatters";
import { STATUS_LABELS, STATUS_BADGE_VARIANTS } from "../../warehouseConstants";

export const mapWarehouseCargoToImportDeclaration = (cargo) => {
  if (!cargo) return null;

  const im = cargo.importMaster || {};
  const aiDocCheck = im.aiDocCheck || null;

  const hasImportMaster = !!(
    cargo.importMaster &&
    cargo.importMaster.importId &&
    String(cargo.importMaster.importId).trim() !== "" &&
    String(cargo.importMaster.importId).toLowerCase() !== "null"
  );

  return {
    declarationId: im.importId || null,
    declarationNumber: im.importNumber || cargo.declNo || "-",
    status: im.status || "STORED",
    statusLabel: STATUS_LABELS[im.status] || STATUS_LABELS["STORED"] || "보관중",
    statusBadgeVariant: STATUS_BADGE_VARIANTS[im.status] || "outline",
    isUrgent: false,
    declarationDateFormatted: formatDate(im.submitDate || im.modDate || cargo.entryDate),
    createdAtFormatted: formatDate(im.modDate || cargo.entryDate),
    updatedAtFormatted: formatDate(im.modDate || cargo.entryDate),

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
      importerTradeName: im.importerName || cargo.repName || "-",
      importerCode: im.customsId || "-",
      importerBizNo: im.bizRegNo || "-",
      repName: im.repName || cargo.repName || "-",
      repTel: im.telNo || "-",
      repTelExt: null,
      repEmail: im.email || "-",
      importerAddress: im.address || "-",
      overseasBizName: im.overseasBizName || "-",
      overseasCountry: im.overseasCountry || "-",
      importType: im.importType || "-",
      cargoMgmtNo: im.cargoMgmtNo || "-",
      vesselName: im.vesselName || "-",
      vesselNation: im.vesselNation || "-",
      arrivalEstDate: formatDate(im.arrivalEstDate),
      bondedInDate: formatDate(im.bondedInDate),
      originCountry: im.originCountry || im.originCode || "-",
      arrivalPort: im.arrivalPort || "-",
      blNo: im.blNo || im.awbNo || "-",
    },

    price: {
      writeDate: formatDate(im.modDate || cargo.entryDate),
      payAmount: im.payAmount || 0,
      payAmountFormatted: `${im.currencyCode || "USD"} ${formatAmount(im.payAmount || 0)}`,
      invoiceNo: im.invoiceNo || "-",
      invoiceDate: formatDate(im.invoiceDate),
      contractNo: im.contractNo || "-",
      contractDate: formatDate(im.contractDate),
      poNo: im.poNo || "-",
      poDate: formatDate(im.poDate),
      incoterms: im.incoterms || "-",
      freightAmt: im.freightAmt || 0,
      freightAmtFormatted: formatCurrency(im.freightAmt || 0, im.freightCurrency || "USD"),
      insuranceAmt: im.insuranceAmt || 0,
      insuranceAmtFormatted: formatCurrency(im.insuranceAmt || 0, im.insuranceCurrency || "USD"),
      addAmt: im.addAmt || 0,
      addAmtFormatted: formatCurrency(im.addAmt || 0, im.addAmtCurrency || "KRW"),
    },

    paymentDetail: {
      currencyCode: im.currencyCode || "USD",
      exchangeRate: 1200,
      exchangeRateFormatted: "1,200",
      totalWeight: im.totalWeight || cargo.grossWeight || 0,
      totalWeightFormatted: formatAmount(im.totalWeight || cargo.grossWeight || 0) + " KG",
      netWeight: im.netWeight || 0,
      netWeightFormatted: formatAmount(im.netWeight || 0) + " KG",
      contNo: im.contNo || cargo.contNumber || "-",
    },

    tax: {
      totalTaxBase: im.totalTaxBase || 0,
      totalTaxBaseFormatted: formatCurrency(im.totalTaxBase || 0, "KRW"),
      totalDuty: im.totalDuty || 0,
      totalDutyFormatted: formatCurrency(im.totalDuty || 0, "KRW"),
      totalVat: im.totalVat || 0,
      totalVatFormatted: formatCurrency(im.totalVat || 0, "KRW"),
      totalTaxSum: im.totalTaxSum || 0,
      totalTaxSumFormatted: formatCurrency(im.totalTaxSum || 0, "KRW"),
    },

    items: [
      {
        itemSequence: 1,
        hsCode: im.hsCode || "-",
        productName: im.itemNameDeclared || cargo.itemName || "-",
        productNameEn: "-",
        modelName: im.modelName || "-",
        quantity: im.qty || cargo.qty || 0,
        unit: im.qtyUnit || "-",
        unitPrice: im.unitPrice || 0,
        unitPriceFormatted: formatCurrency(im.unitPrice || 0, im.currencyCode || "USD"),
        totalAmount: im.totalAmount || 0,
        totalAmountFormatted: formatCurrency(im.totalAmount || 0, im.currencyCode || "USD"),
        originCountry: im.originCountry || im.originCode || "-",
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

    _raw: im,
    _hasImportMaster: hasImportMaster,
    _needsAIFetch: hasImportMaster && !!im.importId && !aiDocCheck,
  };
};
