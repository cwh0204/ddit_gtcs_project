import { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import Button from "../../../../style/components/Button";
import Label from "../../../../style/components/form/Label";
import Select from "../../../../style/components/form/Select";
import { REJECTION_REASONS } from "../../../../constants/reasons/rejectionReasons";
import { INSPECTION_TYPES, INSPECTION_RESULTS, INSPECTION_FAIL_REASONS } from "../../../../constants/reasons/inspectionReasons";
import { cn } from "../../../../style/utils";

// src/pages/customs/export/components/ExportActionForm.jsx

/**
 * ExportActionForm - 수출용 모든 액션 통합 입력 폼 (의견 작성)
 * ✅ 수입페이지 ActionForm과 동일한 기능 구현
 *
 * @param {boolean} isOpen - 폼 열림 상태
 * @param {function} onClose - 폼 닫기 핸들러
 * @param {function} onSubmit - 제출 핸들러
 * @param {boolean} isSubmitting - 제출 중 상태
 * @param {object} checkedItems - 체크된 항목들
 * @param {"supplement" | "correction" | "inspection" | "reject"} actionType - 액션 타입
 * @param {function} onActionTypeChange - 액션 타입 변경 핸들러
 */
function ExportActionForm({ isOpen, onClose, onSubmit, isSubmitting, checkedItems = {}, actionType = "supplement", onActionTypeChange }) {
  const [formData, setFormData] = useState({
    // 공통
    reason: "",

    // 반려 전용
    reasonCode: "",
    reasonDetail: "",

    // 검사 전용
    inspectType: "",
    inspectResult: "",
    inspectComment: "",
    failReasonCode: "",
    failReasonDetail: "",
  });

  const [errors, setErrors] = useState({});

  // ⭐ 수출 필드 라벨 매핑 함수
  const getFieldLabel = (fieldName) => {
    const EXPORT_FIELD_LABELS = {
      // 공통사항1 - 수출화주
      exporterName: "기업명",
      declarantName: "대표자명",
      exporterBusinessNumber: "사업자등록번호",
      buyerIdNo: "거래 상대방 식별번호",
      exporterCode: "통관고유부호",
      exporterAddress: "기업 주소",

      // 공통사항1 - 구매자
      buyerName: "상호",
      buyerAddress: "구매업체 주소",

      // 공통사항1 - 기본신고사항
      dclType: "신고구분",
      transMode: "거래구분",
      exportKind: "수출종류",
      paymentMethod: "결제방법",
      incoterms: "인도조건",
      destCountry: "목적국",
      loadingPort: "적재항",
      transportMode: "운송수단",
      containerMode: "운송용기",
      goodsLoc: "물품소재지",
      goodsType: "물품상태",
      refundApplicant: "환급신청인",

      // 공통사항2 - 환율/금액
      exchangeRate: "적용환율",
      currencyCode: "통화코드",
      paymentAmt: "결제금액",
      freight: "운임",
      insurance: "운송보험료",
      totalDeclAmt: "총 신고금액(KRW)",

      // 공통사항2 - 운송/보세
      containerInd: "컨테이너적입여부",
      cargoMgmtNo: "화물관리번호",
      bondedRepName: "보세운송신고인",
      bondedPeriod: "보세운송신고기간",
      carrierCode: "선박회사(항공사) 코드",
      carrierName: "선박회사(항공사) 명",
      vesselName: "선박명(편명)",
      departDate: "출항예정일자",
      loadBondedArea: "적재예정보세구역",
      containerNo: "컨테이너번호",

      // 물품정보
      hsCode: "HS부호",
      productName: "수출물품명",
      tradeItemName: "거래품명",
      brandName: "상표명",
      modelName: "모델 (규격)",
      quantity: "수량/단위",
      unitPrice: "단가",
      totalWeight: "총중량",
      totalPackCnt: "전체 포장 개수",
      currency: "통화",
      totalPrice: "총 금액",
      invoiceSign: "송장부호",
      attachYn: "Attach여부",
      originCountry: "원산지국가",
      originCriteria: "원산지결정기준",
      originMarkYn: "원산지표시여부",
      originCertType: "원산지증명서 발급구분",

      // 첨부파일
      invoice: "인보이스",
      packingList: "패킹리스트",
      bl: "선하증권(B/L)",
      otherFiles: "기타 첨부파일",

      // 섹션별 통합 체크박스
      common1All: "공통사항1 전체",
      common2All: "공통사항2 전체",
      itemsAll: "물품정보 전체",
      attachmentsAll: "첨부파일 전체",
    };

    return EXPORT_FIELD_LABELS[fieldName] || fieldName;
  };

  // 액션별 설정
  const config = useMemo(() => {
    const configs = {
      supplement: {
        title: "보완 요구",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-300",
        textColor: "text-orange-900",
        infoBgColor: "bg-orange-100",
        infoBorderColor: "border-orange-200",
        infoTextColor: "text-orange-800",
        focusRing: "focus:ring-orange-500",
        borderTopColor: "border-orange-200",
        buttonColor: "bg-orange-500 hover:bg-orange-600",
        actionText: "보완",
        buttonText: "보완 요구",
      },
      correction: {
        title: "정정 요구",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-300",
        textColor: "text-purple-900",
        infoBgColor: "bg-purple-100",
        infoBorderColor: "border-purple-200",
        infoTextColor: "text-purple-800",
        focusRing: "focus:ring-purple-500",
        borderTopColor: "border-purple-200",
        buttonColor: "bg-purple-500 hover:bg-purple-600",
        actionText: "정정",
        buttonText: "정정 요구",
      },
      inspection: {
        title: "현품 검사",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-300",
        textColor: "text-blue-900",
        infoBgColor: "bg-blue-100",
        infoBorderColor: "border-blue-200",
        infoTextColor: "text-blue-800",
        focusRing: "focus:ring-blue-500",
        borderTopColor: "border-blue-200",
        buttonColor: "bg-blue-500 hover:bg-blue-600",
        actionText: "검사",
        buttonText: "검사 완료",
      },
      reject: {
        title: "반려 처리",
        bgColor: "bg-red-50",
        borderColor: "border-red-300",
        textColor: "text-red-900",
        infoBgColor: "bg-red-100",
        infoBorderColor: "border-red-200",
        infoTextColor: "text-red-800",
        focusRing: "focus:ring-red-500",
        borderTopColor: "border-red-200",
        buttonColor: "bg-red-500 hover:bg-red-600",
        actionText: "반려",
        buttonText: "반려 확정",
      },
    };

    return configs[actionType] || configs.supplement;
  }, [actionType]);

  // 체크된 항목들을 텍스트로 자동 생성
  useEffect(() => {
    if (!isOpen) return;

    const checkedFields = Object.entries(checkedItems)
      .filter(([_, isChecked]) => isChecked)
      .map(([fieldName]) => getFieldLabel(fieldName));

    if (checkedFields.length > 0) {
      if (actionType === "supplement" || actionType === "correction") {
        // 보완/정정: reason 필드에 자동 입력
        const autoText = `다음 항목에 대한 ${config.actionText}이 필요합니다:\n- ${checkedFields.join("\n- ")}`;
        setFormData((prev) => ({ ...prev, reason: autoText }));
      } else if (actionType === "reject") {
        // 반려: reasonDetail 필드에 자동 입력
        const autoText = `다음 항목에서 문제가 발견되었습니다:\n- ${checkedFields.join("\n- ")}\n\n`;
        setFormData((prev) => ({ ...prev, reasonDetail: autoText }));
      } else if (actionType === "inspection") {
        // 검사: inspectComment 필드에 자동 입력
        const autoText = `다음 항목에 대한 검사를 실시하였습니다:\n- ${checkedFields.join("\n- ")}\n\n검사 결과: `;
        setFormData((prev) => ({ ...prev, inspectComment: autoText }));
      }
    }
  }, [isOpen, checkedItems, actionType, config.actionText]);

  // 입력 검증
  const validate = () => {
    const newErrors = {};

    // 보완/정정
    if (actionType === "supplement" || actionType === "correction") {
      if (!formData.reason || formData.reason.trim().length < 10) {
        newErrors.reason = `${config.actionText} 요구 사유를 10자 이상 입력하세요.`;
      }
      if (formData.reason.length > 1000) {
        newErrors.reason = `${config.actionText} 요구 사유는 1000자 이내로 입력하세요.`;
      }
    }

    // 반려
    else if (actionType === "reject") {
      if (!formData.reasonCode) {
        newErrors.reasonCode = "반려 사유를 선택하세요.";
      }
      if (!formData.reasonDetail || formData.reasonDetail.trim().length < 10) {
        newErrors.reasonDetail = "상세 사유를 10자 이상 입력하세요.";
      }
      if (formData.reasonDetail.length > 500) {
        newErrors.reasonDetail = "상세 사유는 500자 이내로 입력하세요.";
      }
    }

    // 검사
    else if (actionType === "inspection") {
      if (!formData.inspectType) {
        newErrors.inspectType = "검사 유형을 선택하세요.";
      }
      if (!formData.inspectResult) {
        newErrors.inspectResult = "검사 결과를 선택하세요.";
      }
      if (!formData.inspectComment || formData.inspectComment.trim().length < 10) {
        newErrors.inspectComment = "검사 의견을 10자 이상 입력하세요.";
      }
      if (formData.inspectComment.length > 500) {
        newErrors.inspectComment = "검사 의견은 500자 이내로 입력하세요.";
      }

      // 불합격인 경우 추가 검증
      if (formData.inspectResult === "FAIL") {
        if (!formData.failReasonCode) {
          newErrors.failReasonCode = "불합격 사유를 선택하세요.";
        }
        if (!formData.failReasonDetail || formData.failReasonDetail.trim().length < 10) {
          newErrors.failReasonDetail = "불합격 상세 사유를 10자 이상 입력하세요.";
        }
        if (formData.failReasonDetail.length > 500) {
          newErrors.failReasonDetail = "불합격 상세 사유는 500자 이내로 입력하세요.";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 제출 핸들러
  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit(actionType, formData);

    // 폼 초기화
    setFormData({
      reason: "",
      reasonCode: "",
      reasonDetail: "",
      inspectType: "",
      inspectResult: "",
      inspectComment: "",
      failReasonCode: "",
      failReasonDetail: "",
    });
    setErrors({});
  };

  // 취소 핸들러
  const handleCancel = () => {
    setFormData({
      reason: "",
      reasonCode: "",
      reasonDetail: "",
      inspectType: "",
      inspectResult: "",
      inspectComment: "",
      failReasonCode: "",
      failReasonDetail: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`mt-6 p-6 ${config.bgColor} border-2 ${config.borderColor} rounded-lg`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className={`text-lg font-bold ${config.textColor}`}>{config.title}</h3>

          {/* ⭐ 액션 타입 전환 버튼 */}
          {onActionTypeChange && (
            <div className="flex gap-1 bg-white rounded-md p-1">
              <button
                type="button"
                onClick={() => onActionTypeChange("supplement")}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  actionType === "supplement" ? "bg-orange-500 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                보완
              </button>
              <button
                type="button"
                onClick={() => onActionTypeChange("correction")}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  actionType === "correction" ? "bg-purple-500 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                정정
              </button>
              <button
                type="button"
                onClick={() => onActionTypeChange("inspection")}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  actionType === "inspection" ? "bg-blue-500 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                검사
              </button>
              <button
                type="button"
                onClick={() => onActionTypeChange("reject")}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  actionType === "reject" ? "bg-red-500 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                반려
              </button>
            </div>
          )}
        </div>

        <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* 안내 메시지 */}
      <div className={`mb-4 p-3 ${config.infoBgColor} border ${config.infoBorderColor} rounded text-sm ${config.infoTextColor}`}>
        <p className="font-semibold mb-1">📋 체크된 항목이 자동으로 입력되었습니다</p>
        <p className="text-xs">추가 설명이 필요하면 자유롭게 수정하세요.</p>
      </div>

      {/* ========== 보완/정정 폼 ========== */}
      {(actionType === "supplement" || actionType === "correction") && (
        <div className="mb-4">
          <Label required>{config.actionText} 요구 사유 (최소 10자, 최대 1000자)</Label>
          <textarea
            className={cn(
              "w-full h-48 p-3 border rounded-md resize-none",
              errors.reason ? "border-red-500" : "border-gray-300",
              `focus:outline-none focus:ring-2 ${config.focusRing}`,
            )}
            value={formData.reason}
            onChange={(e) => {
              setFormData({ ...formData, reason: e.target.value });
              setErrors({ ...errors, reason: "" });
            }}
            placeholder={`${config.actionText}이 필요한 사항을 상세히 입력하세요.`}
          />
          <div className="flex items-center justify-between mt-1">
            {errors.reason ? (
              <p className="text-xs text-red-600">{errors.reason}</p>
            ) : (
              <p className="text-xs text-gray-500">{config.actionText} 요구 사유는 화주에게 전달됩니다.</p>
            )}
            <p className="text-xs text-gray-500">{formData.reason.length} / 1000자</p>
          </div>
        </div>
      )}

      {/* ========== 반려 폼 ========== */}
      {actionType === "reject" && (
        <>
          <div className="mb-4">
            <Label required>반려 사유</Label>
            <Select
              value={formData.reasonCode}
              onChange={(e) => {
                setFormData({ ...formData, reasonCode: e.target.value });
                setErrors({ ...errors, reasonCode: "" });
              }}
              className={errors.reasonCode ? "border-red-500" : ""}
            >
              <option value="">선택하세요</option>
              {REJECTION_REASONS.map((reason) => (
                <option key={reason.code} value={reason.code}>
                  {reason.label}
                </option>
              ))}
            </Select>
            {errors.reasonCode && <p className="text-xs text-red-600 mt-1">{errors.reasonCode}</p>}

            {formData.reasonCode && (
              <p className="text-xs text-gray-600 mt-2">{REJECTION_REASONS.find((r) => r.code === formData.reasonCode)?.description}</p>
            )}
          </div>

          <div className="mb-4">
            <Label required>상세 사유 (최소 10자, 최대 500자)</Label>
            <textarea
              className={cn(
                "w-full h-32 p-3 border rounded-md resize-none",
                errors.reasonDetail ? "border-red-500" : "border-gray-300",
                "focus:outline-none focus:ring-2 focus:ring-red-500",
              )}
              value={formData.reasonDetail}
              onChange={(e) => {
                setFormData({ ...formData, reasonDetail: e.target.value });
                setErrors({ ...errors, reasonDetail: "" });
              }}
              placeholder="반려 사유를 상세히 입력하세요."
            />
            <div className="flex items-center justify-between mt-1">
              {errors.reasonDetail ? (
                <p className="text-xs text-red-600">{errors.reasonDetail}</p>
              ) : (
                <p className="text-xs text-gray-500">반려 사유는 화주에게 전달됩니다.</p>
              )}
              <p className="text-xs text-gray-500">{formData.reasonDetail.length} / 500자</p>
            </div>
          </div>
        </>
      )}

      {/* ========== 검사 폼 ========== */}
      {actionType === "inspection" && (
        <>
          <div className="mb-4">
            <Label required>검사 유형</Label>
            <Select
              value={formData.inspectType}
              onChange={(e) => {
                setFormData({ ...formData, inspectType: e.target.value });
                setErrors({ ...errors, inspectType: "" });
              }}
              className={errors.inspectType ? "border-red-500" : ""}
            >
              <option value="">선택하세요</option>
              {INSPECTION_TYPES.map((type) => (
                <option key={type.code} value={type.code}>
                  {type.label}
                </option>
              ))}
            </Select>
            {errors.inspectType && <p className="text-xs text-red-600 mt-1">{errors.inspectType}</p>}

            {formData.inspectType && (
              <p className="text-xs text-gray-600 mt-2">{INSPECTION_TYPES.find((t) => t.code === formData.inspectType)?.description}</p>
            )}
          </div>

          <div className="mb-4">
            <Label required>검사 결과</Label>
            <Select
              value={formData.inspectResult}
              onChange={(e) => {
                const result = e.target.value;
                setFormData({
                  ...formData,
                  inspectResult: result,
                  failReasonCode: result === "PASS" ? "" : formData.failReasonCode,
                  failReasonDetail: result === "PASS" ? "" : formData.failReasonDetail,
                });
                setErrors({ ...errors, inspectResult: "" });
              }}
              className={errors.inspectResult ? "border-red-500" : ""}
            >
              <option value="">선택하세요</option>
              {INSPECTION_RESULTS.map((result) => (
                <option key={result.code} value={result.code}>
                  {result.label}
                </option>
              ))}
            </Select>
            {errors.inspectResult && <p className="text-xs text-red-600 mt-1">{errors.inspectResult}</p>}
          </div>

          <div className="mb-4">
            <Label required>검사 의견 (최소 10자, 최대 500자)</Label>
            <textarea
              className={cn(
                "w-full h-32 p-3 border rounded-md resize-none",
                errors.inspectComment ? "border-red-500" : "border-gray-300",
                "focus:outline-none focus:ring-2 focus:ring-blue-500",
              )}
              value={formData.inspectComment}
              onChange={(e) => {
                setFormData({ ...formData, inspectComment: e.target.value });
                setErrors({ ...errors, inspectComment: "" });
              }}
              placeholder="검사 의견을 상세히 입력하세요."
            />
            <div className="flex items-center justify-between mt-1">
              {errors.inspectComment ? (
                <p className="text-xs text-red-600">{errors.inspectComment}</p>
              ) : (
                <p className="text-xs text-gray-500">검사 의견은 화주에게 전달됩니다.</p>
              )}
              <p className="text-xs text-gray-500">{formData.inspectComment.length} / 500자</p>
            </div>
          </div>

          {/* 불합격 시 추가 입력 */}
          {formData.inspectResult === "FAIL" && (
            <>
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <Label required>불합격 사유</Label>
                <Select
                  value={formData.failReasonCode}
                  onChange={(e) => {
                    const selectedCode = e.target.value;
                    setFormData({ ...formData, failReasonCode: selectedCode });
                    setErrors({ ...errors, failReasonCode: "" });

                    // ⭐ 불합격 사유 선택 시 체크박스 내용도 자동 입력
                    if (selectedCode) {
                      const checkedFields = Object.entries(checkedItems)
                        .filter(([_, isChecked]) => isChecked)
                        .map(([fieldName]) => getFieldLabel(fieldName));

                      if (checkedFields.length > 0) {
                        const autoText = `다음 항목에서 불합격 사유가 확인되었습니다:\n- ${checkedFields.join("\n- ")}\n\n`;
                        setFormData((prev) => ({ ...prev, failReasonDetail: autoText }));
                      }
                    }
                  }}
                  className={errors.failReasonCode ? "border-red-500" : ""}
                >
                  <option value="">선택하세요</option>
                  {INSPECTION_FAIL_REASONS.map((reason) => (
                    <option key={reason.code} value={reason.code}>
                      {reason.label}
                    </option>
                  ))}
                </Select>
                {errors.failReasonCode && <p className="text-xs text-red-600 mt-1">{errors.failReasonCode}</p>}

                {formData.failReasonCode && (
                  <p className="text-xs text-gray-600 mt-2">{INSPECTION_FAIL_REASONS.find((r) => r.code === formData.failReasonCode)?.description}</p>
                )}
              </div>

              <div className="mb-4">
                <Label required>불합격 상세 사유 (최소 10자, 최대 500자)</Label>
                <textarea
                  className={cn(
                    "w-full h-32 p-3 border rounded-md resize-none",
                    errors.failReasonDetail ? "border-red-500" : "border-gray-300",
                    "focus:outline-none focus:ring-2 focus:ring-red-500",
                  )}
                  value={formData.failReasonDetail}
                  onChange={(e) => {
                    setFormData({ ...formData, failReasonDetail: e.target.value });
                    setErrors({ ...errors, failReasonDetail: "" });
                  }}
                  placeholder="불합격 사유를 상세히 입력하세요."
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.failReasonDetail ? (
                    <p className="text-xs text-red-600">{errors.failReasonDetail}</p>
                  ) : (
                    <p className="text-xs text-gray-500">불합격 사유는 화주에게 전달되며, 반려 처리됩니다.</p>
                  )}
                  <p className="text-xs text-gray-500">{formData.failReasonDetail.length} / 500자</p>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* 버튼 */}
      <div className={`flex justify-end gap-2 pt-4 border-t ${config.borderTopColor}`}>
        <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
          취소
        </Button>
        <Button className={`text-white ${config.buttonColor}`} onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "처리 중..." : config.buttonText}
        </Button>
      </div>
    </div>
  );
}

export default ExportActionForm;
