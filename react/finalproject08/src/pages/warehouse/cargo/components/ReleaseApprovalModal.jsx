// src/pages/warehouse/cargo/components/ReleaseApprovalModal.jsx

import { useState, useRef } from "react";
import { X, Upload, CheckCircle, AlertTriangle, MapPin } from "lucide-react";

const LOCATION_PATTERN = /^[A-I]-\d{2}-\d{2}-\d{2}$/;

/**
 * ReleaseApprovalModal - 반출 승인 모달
 * - 국내 창고 위치 입력 (필수, 형식 검증)
 * - 파손 여부 선택 (정상 / 파손)
 * - 사진 첨부 (선택)
 */
function ReleaseApprovalModal({ isOpen, onClose, onSubmit, isSubmitting, cargoInfo }) {
  const [locationInput, setLocationInput] = useState("");
  const [damagedYn, setDamagedYn] = useState("N");
  const [damagedComment, setDamagedComment] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [damagedCommentError, setDamagedCommentError] = useState("");
  const fileInputRef = useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("파일 크기는 10MB 이하여야 합니다.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    let hasError = false;

    // 위치 입력 + 형식 검증
    const location = locationInput.trim().toUpperCase();
    if (!location) {
      setLocationError("국내 창고 위치를 입력해주세요.");
      hasError = true;
    } else if (!LOCATION_PATTERN.test(location)) {
      setLocationError("형식이 올바르지 않습니다. 예: A-01-04-01");
      hasError = true;
    } else {
      setLocationError("");
    }

    // 파손 내용 검증
    if (damagedYn === "Y" && !damagedComment.trim()) {
      setDamagedCommentError("파손 내용을 입력해주세요.");
      hasError = true;
    } else {
      setDamagedCommentError("");
    }

    if (hasError) return;

    onSubmit({
      newWarehouseId: location,
      damagedYn,
      damagedComment: damagedYn === "Y" ? damagedComment.trim() : "",
      photoFile: photoFile || null,
    });
  };

  const handleClose = () => {
    setLocationInput("");
    setLocationError("");
    setDamagedYn("N");
    setDamagedComment("");
    setDamagedCommentError("");
    setPhotoFile(null);
    setPhotoPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-blue-900">반출 승인</h2>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 화물 정보 요약 */}
        {cargoInfo && (
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 text-sm text-gray-600">
            <span className="font-mono font-semibold text-gray-800">{cargoInfo.containerId}</span>
            {cargoInfo.itemName && <span className="ml-2">· {cargoInfo.itemName}</span>}
          </div>
        )}

        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* 국내 창고 위치 입력 */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-blue-500" />
                이동할 국내 창고 위치 <span className="text-red-500">*</span>
              </div>
            </label>
            <input
              type="text"
              value={locationInput}
              onChange={(e) => {
                setLocationInput(e.target.value.toUpperCase());
                if (locationError) setLocationError("");
              }}
              placeholder="예: A-01-04-01"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono ${
                locationError ? "border-red-400" : "border-gray-300"
              }`}
              autoFocus
            />
            {locationError ? (
              <p className="text-xs text-red-500 mt-1">{locationError}</p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">형식: 구역-열-단-층 (예: A-01-04-01)</p>
            )}
          </div>

          {/* 파손 여부 선택 */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              파손 여부 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setDamagedYn("N");
                  setDamagedComment("");
                  setDamagedCommentError("");
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 font-semibold text-sm transition-all ${
                  damagedYn === "N" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                }`}
              >
                <CheckCircle className={`w-4 h-4 ${damagedYn === "N" ? "text-green-500" : "text-gray-400"}`} />
                정상
              </button>
              <button
                type="button"
                onClick={() => setDamagedYn("Y")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 font-semibold text-sm transition-all ${
                  damagedYn === "Y" ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                }`}
              >
                <AlertTriangle className={`w-4 h-4 ${damagedYn === "Y" ? "text-red-500" : "text-gray-400"}`} />
                파손
              </button>
            </div>
          </div>

          {/* 파손 내용 */}
          {damagedYn === "Y" && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                파손 내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={damagedComment}
                onChange={(e) => {
                  setDamagedComment(e.target.value);
                  if (damagedCommentError) setDamagedCommentError("");
                }}
                placeholder="파손 상태를 상세히 입력하세요."
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400 ${
                  damagedCommentError ? "border-red-400" : "border-gray-300"
                }`}
              />
              {damagedCommentError && <p className="text-xs text-red-500 mt-1">{damagedCommentError}</p>}
            </div>
          )}

          {/* 사진 첨부 */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              사진 첨부 <span className="text-gray-400 font-normal">(선택)</span>
            </label>
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="첨부 사진 미리보기"
                  className="w-full max-h-48 object-contain rounded-lg border border-gray-200 bg-gray-50"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
                <p className="text-xs text-gray-500 mt-1">{photoFile?.name}</p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-6 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
              >
                <Upload className="w-6 h-6" />
                <span className="text-sm">클릭하여 사진 업로드</span>
                <span className="text-xs">JPG, PNG, GIF (최대 10MB)</span>
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
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
            disabled={isSubmitting}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "처리 중..." : "반출 승인 확정"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReleaseApprovalModal;
