// src/pages/customs/import/components/EscalateForm.jsx

import { useState } from "react";
import { X, Send } from "lucide-react";

/**
 * EscalateForm - 결재 요청 모달
 * ReleaseApprovalModal과 동일한 오버레이 모달 양식
 * (창고 위치 입력, 파손 여부, 사진 첨부 제외)
 *
 * @param {boolean} isOpen       - 모달 열림 상태
 * @param {function} onClose     - 닫기 핸들러
 * @param {function} onSubmit    - 제출 핸들러 ({ reason }) => void
 * @param {boolean} isSubmitting - 제출 중 상태
 */
function EscalateForm({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (reason.trim().length < 10) {
      setError("결재 요청 사유를 10자 이상 입력하세요.");
      return;
    }
    if (reason.length > 1000) {
      setError("결재 요청 사유는 1000자 이내로 입력하세요.");
      return;
    }
    onSubmit({ reason: reason.trim() });
    setReason("");
    setError("");
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-amber-50">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-amber-900">결재 요청</h2>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 본문 */}
        <div className="px-6 py-5">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              결재 요청 사유 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              placeholder="상급자에게 결재를 요청하는 사유를 상세히 입력하세요.&#10;(예: 고위험 화물로 판단되어 상급자 검토가 필요합니다.)"
              rows={6}
              className={`w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                error ? "border-red-400" : "border-gray-300"
              }`}
              autoFocus
            />
            <div className="flex items-center justify-between mt-1">
              {error ? (
                <p className="text-xs text-red-500">{error}</p>
              ) : (
                <p className="text-xs text-gray-400">결재 요청 사유는 상급자에게 전달됩니다.</p>
              )}
              <p className="text-xs text-gray-400">{reason.length} / 1000자</p>
            </div>
          </div>
        </div>

        {/* 푸터 버튼 */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || reason.trim().length < 10}
            className="px-5 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "요청 중..." : "결재 요청 확정"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EscalateForm;
