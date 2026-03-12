// src/pages/warehouse/cargo/components/InspectionActionForm.jsx

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { CARGO_CHECKLIST_LABELS } from "../../../../domain/warehouse/mapper/labels";
import { INSPECTION_ACTION_CONFIG } from "../../../../domain/warehouse/constants/uiConfig";

/**
 * InspectionActionForm - 검사 완료 / 반출 차단 통합 폼
 *
 * autoText  : checkedItems 기반 파생 텍스트 (useMemo, 읽기전용)
 * userInput : 사용자가 추가로 입력하는 부분 (useState)
 * fullText  : autoText + userInput (textarea 표시값)
 */
function InspectionActionForm({ isOpen, onClose, onSubmit, isSubmitting, checkedItems = {}, actionType = "complete", onActionTypeChange }) {
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState("");

  const config = INSPECTION_ACTION_CONFIG[actionType] ?? INSPECTION_ACTION_CONFIG.complete;

  // 체크된 항목 → 자동 생성 텍스트 (파생값, setState 없음)
  const autoText = useMemo(() => {
    if (!isOpen) return "";
    const fields = Object.entries(checkedItems)
      .filter(([, checked]) => checked)
      .map(([key]) => CARGO_CHECKLIST_LABELS[key] || key);
    return fields.length > 0 ? `${config.autoPrefix}:\n- ${fields.join("\n- ")}\n\n` : "";
  }, [isOpen, checkedItems, actionType]);

  const fullText = autoText + userInput;

  const handleChange = (e) => {
    const val = e.target.value;
    // autoText 앞부분은 보존 — 사용자 입력 영역만 추출
    setUserInput(val.startsWith(autoText) ? val.slice(autoText.length) : val);
    if (error) setError("");
  };

  const handleSubmit = () => {
    if (fullText.trim().length < 10) {
      setError(`${config.label}을 10자 이상 입력하세요.`);
      return;
    }
    if (fullText.length > 1000) {
      setError(`${config.label}은 1000자 이내로 입력하세요.`);
      return;
    }
    onSubmit(actionType, { reason: fullText.trim() });
    setUserInput("");
    setError("");
  };

  const handleCancel = () => {
    setUserInput("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`mt-6 p-6 ${config.bgColor} border-2 ${config.borderColor} rounded-lg`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className={`text-lg font-bold ${config.textColor}`}>{config.title}</h3>

          {onActionTypeChange && actionType !== "block" && (
            <div className="flex gap-1 bg-white rounded-md p-1">
              <button
                type="button"
                onClick={() => onActionTypeChange("complete")}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  actionType === "complete" ? "bg-green-500 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                검사 완료
              </button>
              <button
                type="button"
                onClick={() => onActionTypeChange("block")}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  actionType === "block" ? "bg-red-500 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                반출 차단
              </button>
            </div>
          )}
        </div>

        <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* 입력 필드 */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {config.label} <span className="text-red-500">*</span>
        </label>
        <textarea
          className={`w-full h-48 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 ${config.focusRing} ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          value={fullText}
          onChange={handleChange}
          placeholder={config.placeholder}
        />
        <div className="flex items-center justify-between mt-1">
          {error ? <p className="text-xs text-red-600">{error}</p> : <p className="text-xs text-gray-500">{config.helpText}</p>}
          <p className="text-xs text-gray-500">{fullText.length} / 1000자</p>
        </div>
      </div>

      {/* 버튼 */}
      <div className={`flex justify-end gap-2 pt-4 border-t ${config.borderTopColor}`}>
        <button
          onClick={handleCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || fullText.trim().length < 10}
          className={`px-4 py-2 text-white rounded-md transition-colors ${config.buttonColor} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? "처리 중..." : config.buttonText}
        </button>
      </div>
    </div>
  );
}

export default InspectionActionForm;
