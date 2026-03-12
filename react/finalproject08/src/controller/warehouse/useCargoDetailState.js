// src/controller/warehouse/useCargoDetailState.js

import { useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useCargoDetail } from "./useZonesAndCargo";
import { useWarehouseMutations } from "./useWarehouseMutations";
import { mapCargo, mapWarehouseCargoToImportDeclaration, mapWarehouseCargoToExportDeclaration } from "../../domain/warehouse/warehouseMapper";
import { importApi } from "../../api/customs/import/importApi";
import { exportApi } from "../../api/customs/export/exportApi";
import { useAlertModal } from "../../hooks/useAlertModal";

/**
 * CargoDetailPage 전용 상태 훅
 * - 화물 데이터 로딩 및 변환
 * - 수입/수출 신고서 판별 및 AI 데이터 fetch
 * - 탭 구성
 * - 검사완료 / 반출차단 / 반출승인 / 출고완료 처리
 */
export const useCargoDetailState = () => {
  const navigate = useNavigate();
  const { cargoId } = useParams();
  const { data: rawData, isLoading, error } = useCargoDetail(cargoId);

  // ========== UI 상태 ==========
  const [activeTab, setActiveTab] = useState("cargo");
  const [actionFormOpen, setActionFormOpen] = useState(false);
  const [actionType, setActionType] = useState("block");
  const [checklist, setChecklist] = useState({});
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const { completeImportInspection, completeExportInspection, updateCargoLocation, updateWarehouseStock } = useWarehouseMutations();
  const { alertModal, showSuccess, showError, showWarning, showConfirm } = useAlertModal();

  // ========== 화물 데이터 변환 ==========
  const cargo = useMemo(() => (rawData ? mapCargo(rawData) : null), [rawData]);

  // ========== 현재 상태 판별 ==========
  const isAwaitingInspection = useMemo(() => {
    if (!cargo) return false;
    const importStatus = cargo.importMaster?.status?.toUpperCase();
    const exportStatus = cargo.exportMaster?.status?.toUpperCase();
    // PHYSICAL: 창고관리자가 검사 진행 중
    // INSPECTION: 세관원이 검사 요청한 상태 (창고관리자 처리 전)
    // REVIEWING(심사중)은 제외 - 버튼 미표시
    const INSPECTION_STATUSES = ["PHYSICAL", "INSPECTION"];
    return INSPECTION_STATUSES.includes(importStatus) || INSPECTION_STATUSES.includes(exportStatus);
  }, [cargo]);

  const isAwaitingRelease = useMemo(() => {
    if (!cargo) return false;
    // INSPECTION_COMPLETED 제거: 검사완료는 반출승인 대상이 아님 (세관원 수리 대기 상태)
    // PAY_COMPLETED, ACCEPTED만 반출승인 가능
    const s = (status) => ["PAY_COMPLETED", "ACCEPTED"].includes(status?.toUpperCase());
    return s(cargo.importMaster?.status) || s(cargo.exportMaster?.status);
  }, [cargo]);

  const isAwaitingDelivery = useMemo(() => {
    if (!cargo) return false;
    return cargo.importMaster?.status?.toUpperCase() === "APPROVED" || cargo.exportMaster?.status?.toUpperCase() === "APPROVED";
  }, [cargo]);

  // ========== 수입/수출 구분 ==========
  const isImport = useMemo(() => {
    if (!cargo) return false;
    const hasDeclNoImport = cargo.declNo?.startsWith("IMP");
    const hasImportMaster =
      cargo.importMaster?.importId &&
      String(cargo.importMaster.importId).trim() !== "" &&
      String(cargo.importMaster.importId).toLowerCase() !== "null";
    return hasDeclNoImport || !!hasImportMaster;
  }, [cargo]);

  const isExport = useMemo(() => {
    if (!cargo) return false;
    const hasDeclNoExport = cargo.declNo?.startsWith("EXP");
    const hasExportMaster =
      cargo.exportMaster?.exportId &&
      String(cargo.exportMaster.exportId).trim() !== "" &&
      String(cargo.exportMaster.exportId).toLowerCase() !== "null";
    return hasDeclNoExport || !!hasExportMaster;
  }, [cargo]);

  // ========== 수입 신고서 변환 + AI fetch ==========
  const importDeclarationBase = useMemo(() => (isImport && cargo ? mapWarehouseCargoToImportDeclaration(cargo) : null), [isImport, cargo]);

  const { data: fullImportData } = useQuery({
    queryKey: ["import-detail-for-ai", importDeclarationBase?.declarationId],
    queryFn: () => importApi.getDetail(importDeclarationBase.declarationId),
    enabled: !!(importDeclarationBase?._needsAIFetch && importDeclarationBase?._hasImportMaster && importDeclarationBase?.declarationId),
    staleTime: 5 * 60 * 1000,
  });

  const importDeclaration = useMemo(() => {
    if (!importDeclarationBase) return null;
    if (!importDeclarationBase._hasImportMaster) return importDeclarationBase;
    if (importDeclarationBase._needsAIFetch && fullImportData?.aiDocCheck) {
      const ai = fullImportData.aiDocCheck;
      return {
        ...importDeclarationBase,
        aiAnalysis: {
          checkId: ai.checkId || null,
          checkDate: ai.checkDate || "-",
          riskLevel: ai.riskResult === "RED" ? "RED" : "GREEN",
          riskLevelLabel: ai.riskResult === "RED" ? "Red" : "Green",
          riskLevelColor: ai.riskResult === "RED" ? "danger" : "success",
          riskScore: ai.riskScore || 0,
          docScore: ai.docScore || 0,
          docComment: ai.docComment || "AI 분석 정보 없음",
          riskComment: ai.riskComment || "위험도 분석 정보 없음",
          needsOfficerAction: ai.docScore >= 85 && ai.docScore <= 94,
        },
        _needsAIFetch: false,
      };
    }
    return importDeclarationBase;
  }, [importDeclarationBase, fullImportData]);

  // ========== 수출 신고서 변환 + AI fetch ==========
  const exportDeclarationBase = useMemo(() => (isExport && cargo ? mapWarehouseCargoToExportDeclaration(cargo) : null), [isExport, cargo]);

  const { data: fullExportData } = useQuery({
    queryKey: ["export-detail-for-ai", exportDeclarationBase?.declarationId],
    queryFn: () => exportApi.getDetail(exportDeclarationBase.declarationId),
    enabled: !!(exportDeclarationBase?._needsAIFetch && exportDeclarationBase?._hasExportMaster && exportDeclarationBase?.declarationId),
    staleTime: 5 * 60 * 1000,
  });

  const exportDeclaration = useMemo(() => {
    if (!exportDeclarationBase) return null;
    if (!exportDeclarationBase._hasExportMaster) return exportDeclarationBase;
    if (exportDeclarationBase._needsAIFetch && fullExportData?.aiDocCheck) {
      const ai = fullExportData.aiDocCheck;
      return {
        ...exportDeclarationBase,
        aiAnalysis: {
          checkId: ai.checkId || null,
          checkDate: ai.checkDate || "-",
          riskLevel: ai.riskResult === "RED" ? "RED" : "GREEN",
          riskLevelLabel: ai.riskResult === "RED" ? "Red" : "Green",
          riskLevelColor: ai.riskResult === "RED" ? "danger" : "success",
          riskScore: ai.riskScore || 0,
          docScore: ai.docScore || 0,
          docComment: ai.docComment || "AI 분석 정보 없음",
          riskComment: ai.riskComment || "위험도 분석 정보 없음",
          needsOfficerAction: ai.docScore >= 85 && ai.docScore <= 94,
        },
        _needsAIFetch: false,
      };
    }
    return exportDeclarationBase;
  }, [exportDeclarationBase, fullExportData]);

  // ========== 탭 구성 ==========
  const tabs = useMemo(() => {
    const base = [{ id: "cargo", label: "화물 기본 정보" }];
    if (isImport && importDeclaration?._hasImportMaster) {
      return [
        ...base,
        { id: "common", label: "1. 공통사항" },
        { id: "pricing", label: "2. 결제 및 세액" },
        { id: "items", label: "3. 물품 정보" },
        { id: "attachments", label: "4. 첨부파일" },
      ];
    }
    if (isExport && exportDeclaration?._hasExportMaster) {
      return [
        ...base,
        { id: "common1", label: "1. 공통사항" },
        { id: "common2", label: "2. 환율 및 결제" },
        { id: "items", label: "3. 물품 정보" },
        { id: "attachments", label: "4. 첨부파일" },
      ];
    }
    return base;
  }, [isImport, isExport, importDeclaration, exportDeclaration]);

  // ========== 체크박스 ==========
  const handleCheckChange = (field) => {
    setChecklist((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // ========== 검사완료 / 반출차단 / 출고완료 처리 ==========
  const handleActionSubmit = async (type, data) => {
    try {
      const importNumber = cargo?.importMaster?.importNumber;
      const exportNumber = cargo?.exportMaster?.exportNumber;

      if (!importNumber && !exportNumber) {
        showError("오류", "신고서 번호를 찾을 수 없습니다.");
        return;
      }

      let status;
      if (isAwaitingInspection) {
        status = type === "complete" ? "INSPECTION_COMPLETED" : "REJECTED";
      } else if (isAwaitingRelease) {
        status = "RELEASE_REJECTED";
      } else if (isAwaitingDelivery) {
        status = "DELIVERED";
      }

      if (isImport) {
        await completeImportInspection.mutateAsync({ importNumber, status });
      } else {
        await completeExportInspection.mutateAsync({ exportNumber, status });
      }

      let msg = "처리가 완료되었습니다.";
      if (isAwaitingInspection) {
        msg = type === "complete" ? "검사가 완료되었습니다." : "화물 반출이 차단되었습니다.";
      } else if (isAwaitingRelease) {
        msg = "반출이 차단되었습니다.";
      } else if (isAwaitingDelivery) {
        msg = "출고가 완료되었습니다.";
      }

      showSuccess("처리 완료", msg, () => {
        navigate("/warehouse/cargo");
      });

      setActionFormOpen(false);
      setChecklist({});
    } catch (err) {
      console.error("[처리] 오류:", err);
      showError("처리 실패", err.message);
    }
  };
  // ✨ 수정 시작: 현재 화물 데이터를 복사하여 버퍼(editFormData)에 저장
  const startEdit = useCallback(() => {
    if (!cargo) return;
    setEditFormData({
      uniqueNo: cargo.uniqueNo || "",
      itemName: cargo.itemName || "",
      qty: cargo.quantity || "",
      grossWeight: cargo.weight || "",
      repName: cargo.owner || "", // 매퍼 상 owner가 repName 역할
    });
    setIsEditMode(true);
  }, [cargo]);

  // ✨ 수정 취소
  const cancelEdit = useCallback(() => {
    setIsEditMode(false);
    setEditFormData({});
  }, []);

  // ✨ 입력값 변경: Input의 name과 value를 기반으로 상태 업데이트
  const handleEditChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // ✨ 수정 제출: 백엔드 API 규격에 맞춰 데이터 정제 후 전송
  const handleEditSubmit = async () => {
    try {
      await updateWarehouseStock.mutateAsync({
        stockId: cargo.stockId + "",
        uniqueNo: editFormData.uniqueNo,
        itemName: editFormData.itemName,
        qty: parseInt(editFormData.qty, 10) + "",
        grossWeight: parseFloat(editFormData.grossWeight) + "",
        repName: editFormData.repName,
      });
      showSuccess("수정 완료", "성공적으로 수정되었습니다.");
      setIsEditMode(false);
    } catch (err) {
      showError("수정 실패", err.message);
    }
  };

  // ========== 반출 승인 처리 ==========
  const handleReleaseApprovalSubmit = async ({ newWarehouseId, damagedYn, damagedComment, photoFile }) => {
    try {
      const importNumber = cargo?.importMaster?.importNumber;
      const exportNumber = cargo?.exportMaster?.exportNumber;

      if (!importNumber && !exportNumber) {
        showError("오류", "신고서 번호를 찾을 수 없습니다.");
        return;
      }

      if (isImport) {
        await completeImportInspection.mutateAsync({ importNumber, status: "RELEASE_APPROVED", damagedYn, damagedComment, photoFile });
      } else {
        await completeExportInspection.mutateAsync({ exportNumber, status: "RELEASE_APPROVED", damagedYn, damagedComment, photoFile });
      }

      if (cargo?.stockId && newWarehouseId) {
        await updateCargoLocation.mutateAsync({
          stockId: cargo.stockId,
          newPositionArea: "LOCAL",
          newWarehouseId,
        });
      }

      showSuccess("반출 승인", "반출이 승인되었습니다.\n재고가 국내 창고로 이동되었습니다.", () => {
        navigate("/warehouse/cargo");
      });
      setReleaseModalOpen(false);
      setChecklist({});
    } catch (err) {
      console.error("[반출 승인] 오류:", err);
      showError("처리 실패", err.message);
    }
  };

  const isProcessing = completeImportInspection.isPending || completeExportInspection.isPending;

  return {
    // 데이터
    cargo,
    isImport,
    isExport,
    importDeclaration,
    exportDeclaration,

    // 상태 플래그
    isLoading,
    error,
    isProcessing,
    isAwaitingInspection,
    isAwaitingRelease,
    isAwaitingDelivery,

    // UI 상태
    activeTab,
    setActiveTab,
    actionFormOpen,
    setActionFormOpen,
    actionType,
    setActionType,
    checklist,
    releaseModalOpen,
    setReleaseModalOpen,
    photoModalOpen,
    setPhotoModalOpen,

    // 탭
    tabs,

    // 핸들러
    handleCheckChange,
    handleActionSubmit,
    handleReleaseApprovalSubmit,
    handleBack: () => navigate("/warehouse/cargo"),
    handleEditSubmit, // 위에서 완성한 함수 연결
    startEdit, // 완성한 로직 연결
    cancelEdit: () => {
      setIsEditMode(false);
      setEditFormData({});
    },
    handleEditChange, // 완성한 로직 연결
    isEditMode, // 수정 모드 활성화 여부 (boolean)
    editFormData, // 입력 중인 임시 데이터 (object)

    // 모달
    alertModal,
    showConfirm,
  };
};

export default useCargoDetailState;
