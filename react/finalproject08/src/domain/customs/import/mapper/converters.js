// src/domain/customs/import/mapper/converters.js

//importConstants에서 모든 상수 import
import {
  STATUS_LABELS,
  STATUS_BADGE_VARIANTS,
  RISK_LABELS,
  RISK_LEVELS,
  RISK_COLORS,
  getDocScoreColor,
  getRiskScoreColor,
  getDocScoreLabel,
  getRiskScoreLabel,
  getDocScoreRangeInfo,
  getDocScoreDescription,
  needsOfficerAction,
  getExpectedAutoStatus,
  formatScore,
  formatScoreWithLabel,
} from "../importConstants";

import { formatDateTime, formatDate } from "./utils";

//한글 → 영문 상태 매핑
const normalizeStatus = (status) => {
  const koreanToEnglish = {
    심사대기: "PENDING_REVIEW",
    심사중: "UNDER_REVIEW",
    보완요구: "SUPPLEMENT_REQUESTED",
    승인: "APPROVED",
    반려: "REJECTED",
  };

  return koreanToEnglish[status] || status;
};

//품목
export const toItemModel = (itemDto) => {
  if (!itemDto) return null;

  return {
    itemId: itemDto.itemId || itemDto.id,
    hsCode: itemDto.hsCode || "-",
    productName: itemDto.itemNameDeclared || itemDto.productName || "-",
    specification: itemDto.itemNameTrade || itemDto.specification || "-",
    modelName: itemDto.modelName || "-",

    quantity: itemDto.qty || itemDto.quantity || 0,
    unit: itemDto.qtyUnit || itemDto.unit || "",
    unitPrice: itemDto.unitPrice || 0,

    totalPrice: itemDto.totalAmount || itemDto.totalPrice || 0,
    totalAmount: itemDto.totalAmount || 0,

    netWeight: itemDto.netWeight || 0,
    taxBaseAmtItem: itemDto.taxBaseAmtItem || 0,

    originCountry: itemDto.originCode || itemDto.originCountry || "-",
    originMarkYn: itemDto.originMarkYn === "Y" || itemDto.originMarkYn === true,

    taxType: itemDto.taxType || "-",
    taxBaseType: itemDto.taxBaseType || "-",
  };
};

//리스트
export const toListItem = (dto) => {
  if (!dto) {
    console.warn("[toListItem] DTO가 null입니다.");
    return null;
  }

  const normalizedStatus = normalizeStatus(dto.status);

  //분석 정보 추출 (목록용)
  const ai = dto.aiDocCheck || {};
  const riskScore = ai.riskScore || 0;
  const docScore = ai.docScore || 0;

  //riskScore 기반 위험도 레벨 판정 (50점 이상이면 RED)
  const isRed = riskScore >= 50;
  const riskLevel = isRed ? RISK_LEVELS.RED : RISK_LEVELS.GREEN;
  const riskLevelLabel = RISK_LABELS[riskLevel] || "Green";
  const riskLevelColor = RISK_COLORS[riskLevel] || "success";

  return {
    declarationId: dto.importId,
    declarationNumber: dto.importNumber,

    statusCode: normalizedStatus,
    statusLabel: STATUS_LABELS[normalizedStatus] || dto.status,
    statusBadgeVariant: STATUS_BADGE_VARIANTS[normalizedStatus] || "default",

    importerName: dto.importerName || dto.itemNameDeclared || "-",
    itemName: dto.itemNameDeclared || "-", // ✅ 추가
    declarationDate: formatDateTime(dto.submitDate),
    assignedOfficer: dto.officer?.memName || dto.assignedOfficer || "미배정",

    totalTaxAmount: dto.totalTaxSum || 0,
    totalTaxAmountFormatted: dto.totalTaxSum ? `${dto.totalTaxSum.toLocaleString()}원` : "-",

    isUrgent: dto.isUrgent || false,

    riskLevel: riskLevel,
    riskLevelLabel: riskLevelLabel,
    riskLevelColor: riskLevelColor,

    riskScore: riskScore,
    docScore: docScore,
    aiScore: docScore,

    _totalCount: dto.totalCount,
    _totalPage: dto.totalPage,
    _rnum: dto.rnum,
  };
};

//품목상세
export const toDetailModel = (dto) => {
  if (!dto) {
    console.warn("[toDetailModel] DTO가 null입니다.");
    return null;
  }

  const ai = dto.aiDocCheck || {};
  const docScore = ai.docScore || 0;
  const riskScore = ai.riskScore || 0;
  const docScoreRangeInfo = getDocScoreRangeInfo(docScore);
  const isRed = riskScore >= 50;

  const normalizedStatus = normalizeStatus(dto.status);

  return {
    declarationId: dto.importId,
    declarationNumber: dto.importNumber,

    status: dto.status,
    statusCode: normalizedStatus,
    statusLabel: STATUS_LABELS[normalizedStatus] || STATUS_LABELS[dto.status] || dto.status,
    statusBadgeVariant: STATUS_BADGE_VARIANTS[normalizedStatus] || STATUS_BADGE_VARIANTS[dto.status] || "default",
    updatedAtFormatted: formatDateTime(dto.submitDate),

    aiAnalysis: {
      checkId: ai.checkId,
      checkDate: formatDate(ai.checkDate),
      docNumber: ai.docNumber,

      riskLevel: isRed ? RISK_LEVELS.RED : RISK_LEVELS.GREEN,
      riskLevelLabel: RISK_LABELS[isRed ? RISK_LEVELS.RED : RISK_LEVELS.GREEN] || "Green",
      riskLevelColor: RISK_COLORS[isRed ? RISK_LEVELS.RED : RISK_LEVELS.GREEN] || "success",

      riskScore: riskScore,
      riskScoreFormatted: formatScore(riskScore),
      riskScoreWithLabel: formatScoreWithLabel(riskScore, "risk"),
      riskScoreColor: getRiskScoreColor(riskScore),
      riskScoreLabel: getRiskScoreLabel(riskScore),
      riskComment: ai.riskComment || "위험도 분석 결과가 없습니다.",

      docScore: docScore,
      docScoreFormatted: formatScore(docScore),
      docScoreWithLabel: formatScoreWithLabel(docScore, "doc"),
      docScoreColor: getDocScoreColor(docScore),
      docScoreLabel: getDocScoreLabel(docScore),
      docComment: ai.docComment || "서류 분석 결과가 없습니다.",

      docScoreRange: {
        min: docScoreRangeInfo.min,
        max: docScoreRangeInfo.max,
        label: docScoreRangeInfo.label,
        color: docScoreRangeInfo.color,
        description: docScoreRangeInfo.description,
        shortDesc: docScoreRangeInfo.shortDesc,
        needsOfficerAction: docScoreRangeInfo.needsOfficerAction,
        autoProcessing: docScoreRangeInfo.autoProcessing,
      },

      docScoreDescription: getDocScoreDescription(docScore),
      needsOfficerAction: needsOfficerAction(docScore),
      expectedAutoStatus: getExpectedAutoStatus(docScore),
      expectedAutoStatusLabel: STATUS_LABELS[getExpectedAutoStatus(docScore)],

      hsCodeMatch: ai.hsCodeMatch,
      priceMatch: ai.priceMatch,
      originMatch: ai.originMatch,
      weightMatch: ai.weightMatch,
    },

    audit: {
      auditStatus: dto.auditStatus || dto.status,
      processedBy: dto.processedBy || null,
      processedByName: dto.processedByName || null,
      processedDate: dto.processedDate || null,
      comment: dto.comment || null,
    },

    common: {
      importerTradeName: dto.importerName || "-",
      importerCode: dto.bizRegNo || "-",
      importerCustomsId: dto.customsId || "-",
      importerAddress: dto.address || "-",

      repName: dto.repName || "-",
      repTel: dto.telNo || "-",
      repTelExt: dto.telExt || null,
      repEmail: dto.email || "-",

      overseasBizName: dto.overseasBizName || "-",
      overseasCountry: dto.overseasCountry || "-",

      transMode: dto.transMode || "-",
      vesselName: dto.vesselName || "-",
      vesselNation: dto.vesselNation || "-",
      arrivalPort: dto.arrivalPort || "-",
      arrivalEstDate: formatDate(dto.arrivalEstDate),
      bondedInDate: formatDate(dto.bondedInDate),

      cargoMgmtNo: dto.cargoMgmtNo || "-",
      blNo: dto.blNo || "-",
      awbNo: dto.awbNo || "-",

      importType: dto.importType || "-",
      originCountry: dto.originCountry || "-",
      totalWeight: dto.totalWeight || 0,
      totalWeightFormatted: dto.totalWeight ? `${dto.totalWeight.toLocaleString()} kg` : "0 kg",
      originCertYn: dto.originCertYn === "Y" ? "예" : "아니오",
    },

    price: {
      writeDate: formatDate(dto.submitDate),

      currency: dto.currencyCode || "USD",
      payAmount: dto.payAmount || 0,
      payAmountFormatted: dto.payAmount ? `${dto.currencyCode || "USD"} ${dto.payAmount.toLocaleString()}` : "-",

      invoiceNo: dto.invoiceNo || "-",
      invoiceDate: formatDate(dto.invoiceDate),

      contractNo: dto.contractNo || "-",
      contractDate: formatDate(dto.contractDate),

      poNo: dto.poNo || "-",
      poDate: formatDate(dto.poDate),

      incoterms: dto.incoterms || "-",

      freightCurrency: dto.freightCurrency || "USD",
      freightAmt: dto.freightAmt || 0,
      freightAmtFormatted: dto.freightAmt ? `${dto.freightCurrency || "USD"} ${dto.freightAmt.toLocaleString()}` : "-",

      insuranceCurrency: dto.insuranceCurrency || "USD",
      insuranceAmt: dto.insuranceAmt || 0,
      insuranceAmtFormatted: dto.insuranceAmt ? `${dto.insuranceCurrency || "USD"} ${dto.insuranceAmt.toLocaleString()}` : "-",

      addAmtCurrency: dto.addAmtCurrency || "USD",
      addAmt: dto.addAmt || 0,
      addAmtFormatted: dto.addAmt ? `${dto.addAmtCurrency || "USD"} ${dto.addAmt.toLocaleString()}` : "-",
    },

    paymentDetail: {
      contNo: dto.contNo || "-",
      totalWeight: dto.totalWeight || 0,
      totalWeightFormatted: dto.totalWeight ? `${dto.totalWeight.toLocaleString()} kg` : "0 kg",
      netWeight: dto.netWeight || 0,
      netWeightFormatted: dto.netWeight ? `${dto.netWeight.toLocaleString()} kg` : "0 kg",

      containerList: dto.containerList || [],
    },

    tax: {
      totalTaxBase: dto.totalTaxBase || 0,
      totalTaxBaseFormatted: dto.totalTaxBase ? `${dto.totalTaxBase.toLocaleString()}원` : "-",

      totalDuty: dto.totalDuty || 0,
      totalDutyFormatted: dto.totalDuty ? `${dto.totalDuty.toLocaleString()}원` : "-",

      totalVat: dto.totalVat || 0,
      totalVatFormatted: dto.totalVat ? `${dto.totalVat.toLocaleString()}원` : "-",

      totalTaxSum: dto.totalTaxSum || 0,
      totalTaxSumFormatted: dto.totalTaxSum ? `${dto.totalTaxSum.toLocaleString()}원` : "-",
    },

    items:
      dto.items && Array.isArray(dto.items)
        ? dto.items.map(toItemModel)
        : [
            {
              itemId: dto.importId,
              hsCode: dto.hsCode || "-",
              productName: dto.itemNameDeclared || "-",
              specification: dto.itemNameTrade || "-",
              modelName: dto.modelName || "-",

              quantity: dto.qty || 0,
              unit: dto.qtyUnit || "",
              unitPrice: dto.unitPrice || 0,
              unitPriceFormatted: dto.unitPrice ? `${dto.currencyCode || "USD"} ${dto.unitPrice.toLocaleString()}` : "-",

              totalPrice: dto.totalAmount || 0,
              totalAmount: dto.totalAmount || 0,
              totalAmountFormatted: dto.totalAmount ? `${dto.currencyCode || "USD"} ${dto.totalAmount.toLocaleString()}` : "-",

              netWeight: dto.netWeight || 0,
              netWeightFormatted: dto.netWeight ? `${dto.netWeight.toLocaleString()} kg` : "0 kg",

              taxBaseAmtItem: dto.taxBaseAmtItem || 0,
              taxBaseAmtItemFormatted: dto.taxBaseAmtItem ? `${dto.taxBaseAmtItem.toLocaleString()}원` : "-",

              originCountry: dto.originCode || "-",
              originMarkYn: dto.originMarkYn === "Y",

              taxType: dto.taxType || "-",
              taxBaseType: dto.taxBaseType || "-",
            },
          ],

    essentialFiles: (() => {
      const findFile = (fileType) => {
        const file = dto.fileList?.find((f) => f.fileType === fileType);
        if (!file) return null;

        return {
          fileId: file.fileId,
          name: file.fileName,
          fileName: file.fileName,
          uploadDate: formatDate(file.uploadDate),
          fileType: file.fileType,
          status: "등록", // 기본 상태
        };
      };

      return {
        invoice: findFile("invoice"),
        packingList: findFile("packinglist"),
        bl: findFile("bl"),
      };
    })(),

    fileList:
      dto.fileList
        ?.filter((f) => f.fileType === "other")
        .map((file, index) => ({
          no: index + 1,
          fileId: file.fileId,
          name: file.fileName,
          fileName: file.fileName,
          fileType: file.fileType,
          type: "기타", // UI 표시용
          uploadDate: formatDate(file.uploadDate),
          status: "등록",
        })) || [],
  };
};

export const fromFormData = (formData) => {
  return {
    importerName: formData.importerName,
    bizRegNo: formData.bizRegNo,
    customsId: formData.customsId,
    address: formData.address,

    repName: formData.repName,
    telNo: formData.telNo,
    email: formData.email,

    overseasBizName: formData.overseasBizName,
    overseasCountry: formData.overseasCountry,

    importType: formData.importType,
    transMode: formData.transMode,
    vesselName: formData.vesselName,
    vesselNation: formData.vesselNation,
    arrivalPort: formData.arrivalPort,
    arrivalEstDate: formData.arrivalEstDate,
    bondedInDate: formData.bondedInDate,

    cargoMgmtNo: formData.cargoMgmtNo,
    blNo: formData.blNo,
    awbNo: formData.awbNo,

    currencyCode: formData.currencyCode || "USD",
    payAmount: formData.payAmount,
    invoiceNo: formData.invoiceNo,
    invoiceDate: formData.invoiceDate,
    contractNo: formData.contractNo,
    contractDate: formData.contractDate,
    poNo: formData.poNo,
    poDate: formData.poDate,
    incoterms: formData.incoterms,

    freightCurrency: formData.freightCurrency || "USD",
    freightAmt: formData.freightAmt,
    insuranceCurrency: formData.insuranceCurrency || "USD",
    insuranceAmt: formData.insuranceAmt,
    addAmtCurrency: formData.addAmtCurrency || "USD",
    addAmt: formData.addAmt,

    hsCode: formData.hsCode,
    itemNameDeclared: formData.itemNameDeclared,
    itemNameTrade: formData.itemNameTrade,
    modelName: formData.modelName,
    qty: formData.qty,
    qtyUnit: formData.qtyUnit,
    unitPrice: formData.unitPrice,
    totalAmount: formData.totalAmount,
    netWeight: formData.netWeight,

    originCode: formData.originCode,
    originMarkYn: formData.originMarkYn ? "Y" : "N",
    originCountry: formData.originCountry,

    taxType: formData.taxType,
    taxBaseType: formData.taxBaseType,

    totalTaxBase: formData.totalTaxBase,
    totalDuty: formData.totalDuty,
    totalVat: formData.totalVat,
    totalTaxSum: formData.totalTaxSum,

    status: formData.status || "PENDING_REVIEW",

    contNo: formData.contNo,
    totalWeight: formData.totalWeight,
    originCertYn: formData.originCertYn ? "Y" : "N",
    taxBaseAmtItem: formData.taxBaseAmtItem,
  };
};
