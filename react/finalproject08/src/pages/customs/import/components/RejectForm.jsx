import { X } from "lucide-react";
import { useState } from "react";
import Label from "../../../../style/components/form/Label";
import Select from "../../../../style/components/form/Select";
import Button from "../../../../style/components/Button";
import { REJECTION_REASONS } from "../../../../constants/rejectionReasons";
import { cn } from "../../../../style/utils";

// src/pages/customs/import/components/RejectForm.jsx
function RejectForm({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [formData, setformData] = useState({
    reasonCode: "",
    reasonDetail: "",
  });

  const [errors, setErrors] = useState({});

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

    return Object.keys(newErrors).length === 0; //true, false를 반환한다.
  };

  const handleSubmit = () => {
    if (!validate()) return; //유효하지 않으면

    onSubmit({
      reasonCode: formData.reasonCode,
      reasonDetail: formData.reasonDetail.trim(),
    });

    setformData({ reasonCode: "", reasonDetail: "" });
    setErrors({});
  };

  const handleCancel = () => {
    setformData({ reasonCode: "", reasonDetail: "" });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;
  return (
    <>
      <div className="mt-6 p-6 bg-red-50 border-2 border-red-300 rounded-lg">
        <div className="flex items-center justify-between mtb-4">
          <h3 className="text-lg font-bold text-red-900">반려 사유 입력</h3>
          <button>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 사유코드 선택 */}
        <div className="mb-4">
          <Label required>사유코드</Label>
          <Select
            value={formData.reasonCode}
            onChange={(e) => {
              setformData({ ...formData, reasonCode: e.target.value });
              setErrors({ ...setErrors, reasonCode: "" });
            }}
          >
            <option value="">선택하세요</option>
            {REJECTION_REASONS.map((reason) => (
              <option key={reason.code} value={reason.code}>
                {reason.label}
              </option>
            ))}
          </Select>
          {errors.reasonCode && <p className="text-sm text-red-600 mt-1">{errors.reasonCode}</p>}

          {/* 선택된 사유코드 설명부분 */}
          {formData.reasonCode && (
            <p className="text-xs text-gray-600 mt-2">{REJECTION_REASONS.find((r) => r.code === formData.reasonCode)?.description}</p>
          )}
        </div>

        {/* 상0세사유 입력 */}
        <div className="mb-4">
          <Label required>상세사유(최소 10자, 최대 500자)</Label>
          <textarea
            className={cn(
              "w-full h-32 p-3 border rounded-md resize-none",
              errors.reasonDetail ? "border-red-500" : "border-gray-300",
              "focus:outline-none focus:ring-2 focus:ring-red-500",
            )}
            value={formData.reasonDetail}
            onChange={(e) => {
              setformData({ ...formData, reasonDetail: e.target.value });
              setErrors({ ...errors, reasonDetail: "" });
            }}
            placeholder="반려 사유를 입력하세요"
          />
          <div className="flex items-center justify-between mt-1">
            {errors.reasonDetail ? (
              <p className="text-xs text-red-600">{errors.reasonDetail}</p>
            ) : (
              <p className="text-xs text-gray-500">반려 사유는 화주에게 전달됩니다.</p>
            )}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-2 pt-4 border-t border-red-200">
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            취소
          </Button>
          <Button variant="danger" onClick={handleSubmit} disabled={isSubmitting || !formData.reasonCode || formData.reasonDetail.trim().length < 10}>
            {isSubmitting ? "처리중" : "반려확정"}
          </Button>
        </div>
      </div>
    </>
  );
}

export default RejectForm;
