import { useState } from "react";
import { X } from "lucide-react";
import Button from "../../../../style/components/Button";
import Label from "../../../../style/components/form/Label";
import Select from "../../../../style/components/form/Select";
import { INSPECTION_TYPES, INSPECTION_RESULTS, INSPECTION_FAIL_REASONS } from "../../../../constants/reasons/inspectionReasons";

// src/pages/customs/import/components/InspectionForm.jsx

/**
 * InspectionForm - 현품검사 결과 입력 폼
 *
 * @param {boolean} isOpen - 폼 열림 상태
 * @param {function} onClose - 폼 닫기 핸들러
 * @param {function} onSubmit - 제출 핸들러
 * @param {boolean} isSubmitting - 제출 중 상태
 */
function InspectionForm({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    inspectType: "",
    inspectResult: "",
    inspectComment: "",
    failReasonCode: "",
    failReasonDetail: "",
  });

  const [errors, setErrors] = useState({});

  // 입력 검증
  const validate = () => {
    const newErrors = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 제출 핸들러
  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      inspectType: formData.inspectType,
      inspectResult: formData.inspectResult,
      inspectComment: formData.inspectComment.trim(),
      failReasonCode: formData.inspectResult === "FAIL" ? formData.failReasonCode : null,
      failReasonDetail: formData.inspectResult === "FAIL" ? formData.failReasonDetail.trim() : null,
    });

    // 폼 초기화
    setFormData({
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
      inspectType: "",
      inspectResult: "",
      inspectComment: "",
      failReasonCode: "",
      failReasonDetail: "",
    });
    setErrors({});
    onClose();
  };

  // 검사 결과 변경 시 불합격 관련 필드 초기화
  const handleResultChange = (e) => {
    const result = e.target.value;
    setFormData({
      ...formData,
      inspectResult: result,
      failReasonCode: result === "PASS" ? "" : formData.failReasonCode,
      failReasonDetail: result === "PASS" ? "" : formData.failReasonDetail,
    });
    setErrors({ ...errors, inspectResult: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="mt-6 p-6 bg-blue-50 border-2 border-blue-300 rounded-lg">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-blue-900">현품검사 결과 입력</h3>
        <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* 검사 유형 */}
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

        {/* 선택된 검사 유형 설명 */}
        {formData.inspectType && (
          <p className="text-xs text-gray-600 mt-2">{INSPECTION_TYPES.find((t) => t.code === formData.inspectType)?.description}</p>
        )}
      </div>

      {/* 검사 결과 */}
      <div className="mb-4">
        <Label required>검사 결과</Label>
        <Select value={formData.inspectResult} onChange={handleResultChange} className={errors.inspectResult ? "border-red-500" : ""}>
          <option value="">선택하세요</option>
          {INSPECTION_RESULTS.map((result) => (
            <option key={result.code} value={result.code}>
              {result.label}
            </option>
          ))}
        </Select>
        {errors.inspectResult && <p className="text-xs text-red-600 mt-1">{errors.inspectResult}</p>}
      </div>

      {/* 검사 의견 */}
      <div className="mb-4">
        <Label required>검사 의견 (최소 10자, 최대 500자)</Label>
        <textarea
          className={`w-full h-32 p-3 border rounded-md resize-none ${
            errors.inspectComment ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          value={formData.inspectComment}
          onChange={(e) => {
            setFormData({ ...formData, inspectComment: e.target.value });
            setErrors({ ...errors, inspectComment: "" });
          }}
          placeholder="검사 의견을 상세히 입력하세요. (예: X-RAY 검사 결과 신고 내역과 일치하며, 금지 품목이 발견되지 않았습니다.)"
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
          {/* 불합격 사유코드 */}
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <Label required>불합격 사유</Label>
            <Select
              value={formData.failReasonCode}
              onChange={(e) => {
                setFormData({ ...formData, failReasonCode: e.target.value });
                setErrors({ ...errors, failReasonCode: "" });
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

            {/* 선택된 불합격 사유 설명 */}
            {formData.failReasonCode && (
              <p className="text-xs text-gray-600 mt-2">{INSPECTION_FAIL_REASONS.find((r) => r.code === formData.failReasonCode)?.description}</p>
            )}
          </div>

          {/* 불합격 상세 사유 */}
          <div className="mb-4">
            <Label required>불합격 상세 사유 (최소 10자, 최대 500자)</Label>
            <textarea
              className={`w-full h-32 p-3 border rounded-md resize-none ${
                errors.failReasonDetail ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-red-500`}
              value={formData.failReasonDetail}
              onChange={(e) => {
                setFormData({ ...formData, failReasonDetail: e.target.value });
                setErrors({ ...errors, failReasonDetail: "" });
              }}
              placeholder="불합격 사유를 상세히 입력하세요. (예: 신고 수량 1,000개 대비 실제 수량 950개로 5% 부족함이 확인되었습니다.)"
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

      {/* 버튼 */}
      <div className="flex justify-end gap-2 pt-4 border-t border-blue-200">
        <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            !formData.inspectType ||
            !formData.inspectResult ||
            formData.inspectComment.trim().length < 10 ||
            (formData.inspectResult === "FAIL" && (!formData.failReasonCode || formData.failReasonDetail.trim().length < 10))
          }
        >
          {isSubmitting ? "처리 중..." : "검사 완료"}
        </Button>
      </div>
    </div>
  );
}

export default InspectionForm;
