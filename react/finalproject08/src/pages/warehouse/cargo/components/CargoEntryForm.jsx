import { useState, useCallback, useRef } from "react";
import { Loader2, Upload, X, Image, CheckCircle } from "lucide-react";
import Button from "../../../../style/components/Button";
import FieldGroup from "./form/FieldGroup";
import SectionHeader from "./form/SectionHeader";
import ZoneStatusPanel from "./form/ZoneStatusPanel";
import AlertModal from "../../../../style/components/AlertModal";
import { useAlertModal } from "../../../../hooks/useAlertModal";

// src/pages/warehouse/cargo/components/CargoEntryForm.jsx

function CargoEntryForm({ onSubmit, onCancel, isSubmitting, warehouseType = "BONDED" }) {
  const { alertModal, showWarning } = useAlertModal();
  const [formData, setFormData] = useState({
    uniqueNo: "",
    declNo: "",
    itemName: "",
    qty: "",
    grossWeight: "",
    warehouseId: "",
    repName: "",
    damagedYn: "N",
    damagedComment: "",
  });

  const [entryPhoto, setEntryPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ─── 자동완성 샘플 데이터 ───
  const today = new Date().toISOString().slice(0, 10);

  const SAMPLE_DATA = {
    BONDED: [
      {
        uniqueNo: `BL-${today.replace(/-/g, "")}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`,
        declNo: "",
        itemName: "아크네 블랙 맨투맨 남성용 상의",
        qty: "10",
        grossWeight: "10",
        warehouseId: "G-02-01-01",
        repName: "이미용",
        damagedYn: "N",
        damagedComment: "",
      },
      {
        uniqueNo: `BL-${today.replace(/-/g, "")}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`,
        declNo: "",
        itemName: "아크네 블랙 맨투맨 남성용 상의",
        qty: "10",
        grossWeight: "10",
        warehouseId: "G-02-01-02",
        repName: "이미용",
        damagedYn: "N",
        damagedComment: "",
      },
      {
        uniqueNo: `BL-${today.replace(/-/g, "")}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`,
        declNo: "",
        itemName: "아크네 블랙 맨투맨 남성용 상의",
        qty: "10",
        grossWeight: "10",
        warehouseId: "G-02-02-01",
        repName: "이미용",
        damagedYn: "Y",
        damagedComment: "외부 포장 일부 습기 손상 확인. 내부 제품 상태 양호.",
      },
    ],
    LOCAL: [
      {
        uniqueNo: `BL-${today.replace(/-/g, "")}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`,
        declNo: "",
        itemName: "아크네 트레이닝 블랙 남성용 하의",
        qty: "10",
        grossWeight: "10",
        warehouseId: "H-02-01-01",
        repName: "이미용",
        damagedYn: "N",
        damagedComment: "",
      },
      {
        uniqueNo: `BL-${today.replace(/-/g, "")}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`,
        declNo: "",
        itemName: "아크네 트레이닝 블랙 남성용 하의",
        qty: "10",
        grossWeight: "10",
        warehouseId: "H-02-01-02",
        repName: "이미용",
        damagedYn: "N",
        damagedComment: "",
      },
      {
        uniqueNo: `BL-${today.replace(/-/g, "")}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`,
        declNo: "",
        itemName: "아크네 트레이닝 블랙 남성용 하의",
        qty: "10",
        grossWeight: "10",
        warehouseId: "H-02-02-01",
        repName: "이미용",
        damagedYn: "N",
        damagedComment: "",
      },
    ],
  };

  const handleAutoFill = useCallback(() => {
    const samples = SAMPLE_DATA[warehouseType] || SAMPLE_DATA.BONDED;
    const sample = samples[Math.floor(Math.random() * samples.length)];
    setFormData(sample);
    setErrors({});
    setTouched({});
  }, [warehouseType]);

  const rawZone = formData.warehouseId?.charAt(0)?.toUpperCase();
  const highlightZone = "ABCDEFGHI".includes(rawZone) ? rawZone : null;

  const inputBase =
    "w-full px-3 py-2 border rounded-lg text-sm text-gray-900 placeholder-gray-400 " +
    "focus:outline-none focus:ring-2 disabled:opacity-50 disabled:bg-gray-50 bg-white";
  const inputNormal = `${inputBase} border-gray-300 focus:ring-[#0f4c81]/40 focus:border-[#0f4c81]`;
  const inputError = `${inputBase} border-red-400 focus:ring-red-300 focus:border-red-400`;

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleBlur = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showWarning("파일 형식 오류", "이미지 파일만 업로드 가능합니다.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showWarning("파일 크기 초과", "파일 크기는 5MB 이하여야 합니다.");
      return;
    }
    setEntryPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const handleRemovePhoto = useCallback(() => {
    setEntryPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const validate = (data) => {
    const e = {};
    if (!data.uniqueNo.trim()) e.uniqueNo = "B/L 또는 AWB 번호를 입력해주세요.";
    if (!data.itemName.trim()) e.itemName = "품목명을 입력해주세요.";
    if (!data.qty) e.qty = "수량을 입력해주세요.";
    else if (parseInt(data.qty) <= 0) e.qty = "수량은 0보다 커야 합니다.";
    if (!data.grossWeight) e.grossWeight = "총중량을 입력해주세요.";
    else if (parseFloat(data.grossWeight) <= 0) e.grossWeight = "총중량은 0보다 커야 합니다.";
    if (!data.warehouseId.trim()) e.warehouseId = "적재위치를 입력해주세요.";
    else if (!/^[A-I]-\d{2}-\d{2}-\d{2}$/.test(data.warehouseId)) e.warehouseId = "형식: A-04-03-01";
    if (!data.repName.trim()) e.repName = "화주명을 입력해주세요.";
    if (data.damagedYn === "Y" && !data.damagedComment.trim()) e.damagedComment = "손상 내용을 입력해주세요.";
    return e;
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setTouched({ uniqueNo: true, itemName: true, qty: true, grossWeight: true, warehouseId: true, repName: true });
      const newErrors = validate(formData);
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return;
      onSubmit(
        {
          uniqueNo: formData.uniqueNo.trim(),
          declNo: formData.declNo.trim() || null,
          itemName: formData.itemName.trim(),
          qty: parseInt(formData.qty),
          grossWeight: parseInt(formData.grossWeight),
          warehouseId: formData.warehouseId.trim().toUpperCase(),
          repName: formData.repName.trim(),
          damagedYn: formData.damagedYn,
          damagedComment: formData.damagedComment.trim() || null,
          positionArea: warehouseType,
        },
        entryPhoto,
      );
    },
    [formData, warehouseType, entryPhoto, onSubmit],
  );

  const f = (field) => ({
    isErr: !!(touched[field] && errors[field]),
    cls: touched[field] && errors[field] ? inputError : inputNormal,
  });

  return (
    <div className="flex gap-0 min-h-0">
      {/* ══════════════════════════════════
          좌측: 입력 폼 (60%)
      ══════════════════════════════════ */}
      <form onSubmit={handleSubmit} className="w-[60%] pr-6 space-y-7 overflow-y-auto">
        {/* 화물 식별 정보 */}
        <section>
          <div className="flex items-center justify-between">
            <SectionHeader title="화물 식별 정보" />
            <button
              type="button"
              onClick={handleAutoFill}
              disabled={isSubmitting}
              className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              자동완성
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldGroup label="B/L 또는 AWB 번호" required error={errors.uniqueNo} touched={touched.uniqueNo}>
              <input
                type="text"
                value={formData.uniqueNo}
                onChange={(e) => handleChange("uniqueNo", e.target.value)}
                onBlur={() => handleBlur("uniqueNo")}
                placeholder="예: BL-20260210-001"
                disabled={isSubmitting}
                className={f("uniqueNo").cls}
              />
            </FieldGroup>
            <FieldGroup label="신고번호">
              <input
                type="text"
                value={formData.declNo}
                onChange={(e) => handleChange("declNo", e.target.value)}
                placeholder="선택사항"
                disabled={isSubmitting}
                className={inputNormal}
              />
            </FieldGroup>
          </div>
        </section>

        {/* 화물 정보 */}
        <section>
          <SectionHeader title="화물 정보" />
          <div className="grid grid-cols-2 gap-4">
            <FieldGroup label="품목명" required error={errors.itemName} touched={touched.itemName}>
              <input
                type="text"
                value={formData.itemName}
                onChange={(e) => handleChange("itemName", e.target.value)}
                onBlur={() => handleBlur("itemName")}
                placeholder="예: Laptop Computer"
                disabled={isSubmitting}
                className={f("itemName").cls}
              />
            </FieldGroup>
            <FieldGroup label="화주명" required error={errors.repName} touched={touched.repName}>
              <input
                type="text"
                value={formData.repName}
                onChange={(e) => handleChange("repName", e.target.value)}
                onBlur={() => handleBlur("repName")}
                placeholder="예: 삼성전자(주)"
                disabled={isSubmitting}
                className={f("repName").cls}
              />
            </FieldGroup>
            <FieldGroup label="수량" required error={errors.qty} touched={touched.qty}>
              <input
                type="number"
                value={formData.qty}
                onChange={(e) => handleChange("qty", e.target.value)}
                onBlur={() => handleBlur("qty")}
                placeholder="10"
                min="1"
                disabled={isSubmitting}
                className={f("qty").cls}
              />
            </FieldGroup>
            <FieldGroup label="총중량 (kg)" required error={errors.grossWeight} touched={touched.grossWeight}>
              <input
                type="number"
                value={formData.grossWeight}
                onChange={(e) => handleChange("grossWeight", e.target.value)}
                onBlur={() => handleBlur("grossWeight")}
                placeholder="1000"
                min="1"
                disabled={isSubmitting}
                className={f("grossWeight").cls}
              />
            </FieldGroup>
          </div>
        </section>

        {/* 적재 위치 */}
        <section>
          <SectionHeader title="적재 위치" />
          <FieldGroup
            label="창고 위치"
            required
            error={errors.warehouseId}
            touched={touched.warehouseId}
            hint="구역-열-단-층 형식 (예: A-04-03-01). 우측 구역 현황을 참고하세요."
          >
            <div className="relative">
              <input
                type="text"
                value={formData.warehouseId}
                onChange={(e) => handleChange("warehouseId", e.target.value.toUpperCase())}
                onBlur={() => handleBlur("warehouseId")}
                placeholder="A-04-03-01"
                disabled={isSubmitting}
                className={`${f("warehouseId").cls} font-mono pr-9`}
              />
              {highlightZone && !(touched.warehouseId && errors.warehouseId) && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0f4c81] pointer-events-none" />
              )}
            </div>
          </FieldGroup>
        </section>

        {/* 화물 상태 및 사진 */}
        <section>
          <SectionHeader title="화물 상태 및 사진" />
          <div className="space-y-5">
            <FieldGroup label="화물 손상 여부" required>
              <div className="flex gap-6 mt-1">
                {[
                  { value: "N", label: "정상" },
                  { value: "Y", label: "손상" },
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="damagedYn"
                      value={value}
                      checked={formData.damagedYn === value}
                      onChange={(e) => handleChange("damagedYn", e.target.value)}
                      disabled={isSubmitting}
                      className="w-4 h-4 accent-[#0f4c81]"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </FieldGroup>

            {formData.damagedYn === "Y" && (
              <FieldGroup label="손상 내용" required error={errors.damagedComment} touched={touched.damagedComment}>
                <textarea
                  value={formData.damagedComment}
                  onChange={(e) => handleChange("damagedComment", e.target.value)}
                  onBlur={() => handleBlur("damagedComment")}
                  placeholder="손상 부위 및 정도를 상세히 기록해주세요."
                  rows={3}
                  disabled={isSubmitting}
                  className={`${f("damagedComment").cls} resize-none`}
                />
              </FieldGroup>
            )}

            <FieldGroup label="입고 사진 (최대 5MB, 선택)">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} disabled={isSubmitting} className="hidden" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-[#f9fbff] hover:border-[#0f4c81] transition-colors flex items-center gap-2 disabled:opacity-50 text-sm"
              >
                <Upload className="w-4 h-4" />
                {entryPhoto ? "파일 변경" : "파일 선택"}
              </button>

              {photoPreview && (
                <div className="mt-3 relative inline-block">
                  <img src={photoPreview} alt="입고 사진 미리보기" className="max-w-sm max-h-48 rounded-lg border border-gray-200" />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                  <div className="mt-1.5 text-xs text-gray-500 flex items-center gap-1.5">
                    <Image className="w-3.5 h-3.5" />
                    <span>{entryPhoto?.name}</span>
                    <span>({(entryPhoto?.size / 1024).toFixed(1)} KB)</span>
                  </div>
                </div>
              )}
            </FieldGroup>
          </div>
        </section>

        {/* 버튼 */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-[#0f4c81] hover:bg-[#0d3f6e] text-white">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            입고 등록
          </Button>
        </div>
      </form>

      {/* ══════════════════════════════════
          우측: 구역 현황 패널 (40%)
      ══════════════════════════════════ */}
      <div className="w-[40%] pl-6 border-l border-gray-200">
        <ZoneStatusPanel warehouseType={warehouseType} selectedZone={highlightZone} />
      </div>
      <AlertModal {...alertModal} />
    </div>
  );
}

export default CargoEntryForm;
