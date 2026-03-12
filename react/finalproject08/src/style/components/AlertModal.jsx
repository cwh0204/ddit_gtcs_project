import { CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

// src/style/components/AlertModal.jsx

/**
 * AlertModal - alert() / confirm() 대체 모달
 *
 * @param {boolean} isOpen - 모달 열림 여부
 * @param {function} onClose - 닫기 핸들러
 * @param {string} title - 모달 제목
 * @param {string} message - 모달 메시지 (줄바꿈은 \n 사용)
 * @param {"success"|"error"|"warning"|"info"} type - 아이콘/색상 유형
 * @param {string} confirmText - 확인 버튼 텍스트 (기본: "확인")
 * @param {function} onConfirm - 확인 버튼 클릭 핸들러 (없으면 onClose 사용)
 * @param {boolean} showCancel - 취소 버튼 표시 여부 (confirm 모드)
 * @param {string} cancelText - 취소 버튼 텍스트 (기본: "취소")
 * @param {function} onCancel - 취소 버튼 클릭 핸들러 (없으면 onClose 사용)
 */

const ICON_MAP = {
  success: { icon: CheckCircle, bgColor: "bg-green-50", iconColor: "text-green-500" },
  error: { icon: XCircle, bgColor: "bg-red-50", iconColor: "text-red-500" },
  warning: { icon: AlertTriangle, bgColor: "bg-amber-50", iconColor: "text-amber-500" },
  info: { icon: Info, bgColor: "bg-blue-50", iconColor: "text-blue-500" },
};

function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  confirmText = "확인",
  onConfirm,
  showCancel = false,
  cancelText = "취소",
  onCancel,
}) {
  const config = ICON_MAP[type] || ICON_MAP.info;
  const IconComponent = config.icon;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center">
        {/* 아이콘 */}
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${config.bgColor}`}>
          <IconComponent className={`w-7 h-7 ${config.iconColor}`} />
        </div>

        {/* 제목 */}
        {title && <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>}

        {/* 메시지 */}
        {message && <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed mb-6">{message}</p>}

        {/* 버튼 */}
        <div className="flex gap-3 w-full justify-center">
          {showCancel && (
            <Button variant="outline" onClick={handleCancel} className="min-w-[100px]">
              {cancelText}
            </Button>
          )}
          <Button variant={type === "error" ? "danger" : "primary"} onClick={handleConfirm} className="min-w-[100px]">
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default AlertModal;
