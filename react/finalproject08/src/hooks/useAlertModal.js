import { useState, useCallback } from "react";

// src/hooks/useAlertModal.js

/**
 * useAlertModal - alert() / confirm() 대체 훅
 *
 * 사용법:
 * const { alertModal, showAlert, showError, showSuccess, showConfirm } = useAlertModal();
 *
 * // alert 대체
 * showSuccess("저장 완료", "성공적으로 저장되었습니다.");
 * showError("오류 발생", "저장에 실패했습니다.");
 * showAlert("알림", "메시지");
 *
 * // confirm 대체
 * showConfirm("삭제 확인", "정말 삭제하시겠습니까?", () => { 삭제로직 });
 *
 * // JSX에 추가
 * <AlertModal {...alertModal} />
 */
export const useAlertModal = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    confirmText: "확인",
    showCancel: false,
    cancelText: "취소",
    onConfirm: null,
    onCancel: null,
  });

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  /**
   * 기본 알림 (info)
   */
  const showAlert = useCallback((title, message, onConfirm) => {
    setModalState({
      isOpen: true,
      title,
      message,
      type: "info",
      confirmText: "확인",
      showCancel: false,
      cancelText: "취소",
      onConfirm: onConfirm || null,
      onCancel: null,
    });
  }, []);

  /**
   * 성공 알림
   */
  const showSuccess = useCallback((title, message, onConfirm) => {
    setModalState({
      isOpen: true,
      title,
      message,
      type: "success",
      confirmText: "확인",
      showCancel: false,
      cancelText: "취소",
      onConfirm: onConfirm || null,
      onCancel: null,
    });
  }, []);

  /**
   * 에러 알림
   */
  const showError = useCallback((title, message, onConfirm) => {
    setModalState({
      isOpen: true,
      title,
      message,
      type: "error",
      confirmText: "확인",
      showCancel: false,
      cancelText: "취소",
      onConfirm: onConfirm || null,
      onCancel: null,
    });
  }, []);

  /**
   * 경고 알림
   */
  const showWarning = useCallback((title, message, onConfirm) => {
    setModalState({
      isOpen: true,
      title,
      message,
      type: "warning",
      confirmText: "확인",
      showCancel: false,
      cancelText: "취소",
      onConfirm: onConfirm || null,
      onCancel: null,
    });
  }, []);

  /**
   * 확인/취소 모달 (confirm 대체)
   */
  const showConfirm = useCallback((title, message, onConfirm, onCancel) => {
    setModalState({
      isOpen: true,
      title,
      message,
      type: "warning",
      confirmText: "확인",
      showCancel: true,
      cancelText: "취소",
      onConfirm: onConfirm || null,
      onCancel: onCancel || null,
    });
  }, []);

  // AlertModal에 전달할 props
  const alertModal = {
    isOpen: modalState.isOpen,
    onClose: closeModal,
    title: modalState.title,
    message: modalState.message,
    type: modalState.type,
    confirmText: modalState.confirmText,
    showCancel: modalState.showCancel,
    cancelText: modalState.cancelText,
    onConfirm: () => {
      if (modalState.onConfirm) modalState.onConfirm();
      closeModal();
    },
    onCancel: () => {
      if (modalState.onCancel) modalState.onCancel();
      closeModal();
    },
  };

  return {
    alertModal,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showConfirm,
    closeModal,
  };
};

export default useAlertModal;
