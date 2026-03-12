import { useState } from "react";
import { X } from "lucide-react";
import Button from "../../../../style/components/Button";
import Label from "../../../../style/components/form/Label";
import Select from "../../../../style/components/form/Select";
import { HOLD_REASONS } from "../../../../constants/holdReasons";

// src/pages/customs/import/components/HoldForm.jsx

/**
 * HoldForm - 보류 사유 입력 폼 (토글 영역)
 *
 * @param {boolean} isOpen - 폼 열림 상태
 * @param {function} onClose - 폼 닫기 핸들러
 * @param {function} onSubmit - 제출 핸들러
 * @param {boolean} isSubmitting - 제출 중 상태
 */
function HoldForm({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    reasonCode: "",
    reasonDetail: "",
  });

  const [errors, setErrors] = useState({});

  // 입력 검증
  const validate = () => {
    const newErrors = {};

    if (!formData.reasonCode) {
      newErrors.reasonCode = "사유코드를 선택하세요.";
    }

    if (!formData.reasonDetail || formData.reasonDetail.trim().length < 10) {
      newErrors.reasonDetail = "상세 사유를 10자 이상 입력하세요.";
    }

    if (formData.reasonDetail.length > 500) {
      newErrors.reasonDetail = "상세 사유는 500자 이내로 입력하세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 제출 핸들러
  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      reasonCode: formData.reasonCode,
      reasonDetail: formData.reasonDetail.trim(),
    });

    // 폼 초기화
    setFormData({ reasonCode: "", reasonDetail: "" });
    setErrors({});
  };

  // 취소 핸들러
  const handleCancel = () => {
    setFormData({ reasonCode: "", reasonDetail: "" });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="mt-6 p-6 bg-yellow-50 border-2 border-yellow-300">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-yellow-900">보류 사유 입력</h3>
        <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* 사유코드 선택 */}
      <div className="mb-4">
        <Label required>사유코드</Label>
        <Select
          value={formData.reasonCode}
          onChange={(e) => {
            setFormData({ ...formData, reasonCode: e.target.value });
            setErrors({ ...errors, reasonCode: "" });
          }}
          className={errors.reasonCode ? "border-red-500" : ""}
        >
          <option value="">선택하세요</option>
          {HOLD_REASONS.map((reason) => (
            <option key={reason.code} value={reason.code}>
              {reason.label}
            </option>
          ))}
        </Select>
        {errors.reasonCode && <p className="text-xs text-red-600 mt-1">{errors.reasonCode}</p>}

        {/* 선택된 사유코드 설명 */}
        {formData.reasonCode && <p className="text-xs text-gray-600 mt-2">{HOLD_REASONS.find((r) => r.code === formData.reasonCode)?.description}</p>}
      </div>

      {/* 상세 사유 입력 */}
      <div className="mb-4">
        <Label required>상세 사유 (최소 10자, 최대 500자)</Label>
        <textarea
          className={`w-full h-32 p-3 border resize-none ${
            errors.reasonDetail ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-yellow-500`}
          value={formData.reasonDetail}
          onChange={(e) => {
            setFormData({ ...formData, reasonDetail: e.target.value });
            setErrors({ ...errors, reasonDetail: "" });
          }}
          placeholder="보류 사유를 상세히 입력하세요. (예: 가격 검증을 위해 추가 자료를 확인 중입니다. 3일 이내에 결과를 통보하겠습니다.)"
        />
        <div className="flex items-center justify-between mt-1">
          {errors.reasonDetail ? (
            <p className="text-xs text-red-600">{errors.reasonDetail}</p>
          ) : (
            <p className="text-xs text-gray-500">보류 사유는 화주에게 전달됩니다.</p>
          )}
          <p className="text-xs text-gray-500">{formData.reasonDetail.length} / 500자</p>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-2 pt-4 border-t border-yellow-200">
        <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
          취소
        </Button>
        <Button
          variant="secondary"
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.reasonCode || formData.reasonDetail.trim().length < 10}
        >
          {isSubmitting ? "처리 중..." : "보류 확정"}
        </Button>
      </div>
    </div>
  );
}

export default HoldForm;
