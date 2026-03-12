import { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import Button from "../../../../style/components/Button";
import Label from "../../../../style/components/form/Label";

// src/pages/customs/import/components/RequestForm.jsx

/**
 * RequestForm - 보완요청/정정요청 통합 입력 폼
 *
 * @param {boolean} isOpen - 폼 열림 상태
 * @param {function} onClose - 폼 닫기 핸들러
 * @param {function} onSubmit - 제출 핸들러
 * @param {boolean} isSubmitting - 제출 중 상태
 * @param {object} checkedItems - 체크된 항목들 (예: { importerTradeName: true, ... })
 * @param {"supplement" | "correction"} type - 요청 타입
 * @param {function} onTypeChange - 타입 변경 핸들러 (선택사항)
 */
function RequestForm({ isOpen, onClose, onSubmit, isSubmitting, checkedItems = {}, type = "supplement", onTypeChange }) {
  const [formData, setFormData] = useState({
    reason: "",
  });

  const [errors, setErrors] = useState({});

  // 체크된 항목을 텍스트로 변환하는 매핑
  const FIELD_LABELS = {
    // 거래당사자 정보
    importerTradeName: "기업명",
    importerCode: "통관고유부호",
    importerBizNo: "사업자등록번호",
    repName: "성명",
    repTel: "전화번호(내선)",
    repEmail: "이메일",
    importerAddress: "주소",
    overseasBizName: "해외거래처명",
    overseasCountry: "국적",

    // 기본신고사항
    importType: "수입종류",
    cargoMgmtNo: "화물관리번호",
    vesselName: "선기명",
    vesselNation: "선기국적",
    arrivalEstDate: "입항(예정)일",
    bondedInDate: "보세구역 반입일자",
    originCountry: "수입국",
    arrivalPort: "도착항",
    blNo: "B/L(AWB)",

    // 결제 및 세액
    pricingInfo: "결제 및 세액 정보",

    // 물품 정보
    itemsInfo: "물품 정보",

    // 첨부파일
    attachmentsInfo: "첨부파일",
  };

  // 타입별 설정 (보완 vs 정정)
  const config = useMemo(() => {
    if (type === "correction") {
      return {
        title: "정정 요구 사유 입력",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-300",
        textColor: "text-purple-900",
        infoBgColor: "bg-purple-100",
        infoBorderColor: "border-purple-200",
        infoTextColor: "text-purple-800",
        focusRing: "focus:ring-purple-500",
        borderTopColor: "border-purple-200",
        actionText: "정정",
        placeholder: "정정이 필요한 사항을 상세히 입력하세요.",
        helpText: "정정 요구 사유는 화주에게 전달됩니다.",
        buttonText: "정정 요구",
      };
    }

    // type === "supplement" (기본값)
    return {
      title: "보완 요구 사유 입력",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-300",
      textColor: "text-orange-900",
      infoBgColor: "bg-orange-100",
      infoBorderColor: "border-orange-200",
      infoTextColor: "text-orange-800",
      focusRing: "focus:ring-orange-500",
      borderTopColor: "border-orange-200",
      actionText: "보완",
      placeholder: "보완이 필요한 사항을 상세히 입력하세요.",
      helpText: "보완 요구 사유는 화주에게 전달됩니다.",
      buttonText: "보완 요구",
    };
  }, [type]);

  // 체크된 항목들을 텍스트로 자동 생성
  useEffect(() => {
    if (!isOpen) return;

    const checkedFields = Object.entries(checkedItems)
      .filter(([_, isChecked]) => isChecked)
      .map(([fieldName]) => FIELD_LABELS[fieldName] || fieldName);

    if (checkedFields.length > 0) {
      const autoText = `다음 항목에 대한 ${config.actionText}이 필요합니다:\n- ${checkedFields.join("\n- ")}`;
      setFormData({ reason: autoText });
    } else {
      setFormData({ reason: "" });
    }
  }, [isOpen, checkedItems, config.actionText]);

  // 입력 검증
  const validate = () => {
    const newErrors = {};

    if (!formData.reason || formData.reason.trim().length < 10) {
      newErrors.reason = `${config.actionText} 요구 사유를 10자 이상 입력하세요.`;
    }

    if (formData.reason.length > 1000) {
      newErrors.reason = `${config.actionText} 요구 사유는 1000자 이내로 입력하세요.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 제출 핸들러
  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      reason: formData.reason.trim(),
    });

    // 폼 초기화
    setFormData({ reason: "" });
    setErrors({});
  };

  // 취소 핸들러
  const handleCancel = () => {
    setFormData({ reason: "" });
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

          {/* ⭐ 타입 전환 버튼 (onTypeChange가 있을 때만 표시) */}
          {onTypeChange && (
            <div className="flex gap-1 bg-white rounded-md p-1">
              <button
                type="button"
                onClick={() => onTypeChange("supplement")}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  type === "supplement" ? "bg-orange-500 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                보완
              </button>
              <button
                type="button"
                onClick={() => onTypeChange("correction")}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  type === "correction" ? "bg-purple-500 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                정정
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

      {/* 요구 사유 */}
      <div className="mb-4">
        <Label required>{config.actionText} 요구 사유 (최소 10자, 최대 1000자)</Label>
        <textarea
          className={`w-full h-48 p-3 border rounded-md resize-none ${
            errors.reason ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 ${config.focusRing}`}
          value={formData.reason}
          onChange={(e) => {
            setFormData({ reason: e.target.value });
            setErrors({ ...errors, reason: "" });
          }}
          placeholder={config.placeholder}
        />
        <div className="flex items-center justify-between mt-1">
          {errors.reason ? <p className="text-xs text-red-600">{errors.reason}</p> : <p className="text-xs text-gray-500">{config.helpText}</p>}
          <p className="text-xs text-gray-500">{formData.reason.length} / 1000자</p>
        </div>
      </div>

      {/* 버튼 */}
      <div className={`flex justify-end gap-2 pt-4 border-t ${config.borderTopColor}`}>
        <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
          취소
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting || formData.reason.trim().length < 10}>
          {isSubmitting ? "처리 중..." : config.buttonText}
        </Button>
      </div>
    </div>
  );
}

export default RequestForm;
