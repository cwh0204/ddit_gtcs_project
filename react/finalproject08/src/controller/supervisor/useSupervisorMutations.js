// src/controller/supervisor/useSupervisorMutations.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supervisorApi } from "../../api/supervisor/supervisorApi";
import { SUPERVISOR_QUERY_KEYS } from "./useSupervisorController";

// ========================================
// 수출 담당자 수동배정
// ========================================
export const useAssignExportOfficer = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => supervisorApi.assignExportOfficer(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPERVISOR_QUERY_KEYS.exportList });
      queryClient.invalidateQueries({ queryKey: SUPERVISOR_QUERY_KEYS.officerList });
      queryClient.invalidateQueries({ queryKey: SUPERVISOR_QUERY_KEYS.dashboard });
    },
    ...options,
  });
};

// ========================================
// 수입 담당자 수동배정
// ========================================
export const useAssignImportOfficer = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => supervisorApi.assignImportOfficer(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPERVISOR_QUERY_KEYS.importList });
      queryClient.invalidateQueries({ queryKey: SUPERVISOR_QUERY_KEYS.officerList });
      queryClient.invalidateQueries({ queryKey: SUPERVISOR_QUERY_KEYS.dashboard });
    },
    ...options,
  });
};

// ========================================
// 수입 상태 변경 (결재/반려)
// ========================================
export const useUpdateImportStatus = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => supervisorApi.updateImportStatus(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPERVISOR_QUERY_KEYS.importList });
      queryClient.invalidateQueries({ queryKey: SUPERVISOR_QUERY_KEYS.approvalList });
      queryClient.invalidateQueries({ queryKey: SUPERVISOR_QUERY_KEYS.dashboard });
    },
    ...options,
  });
};

// ========================================
// 수출 상태 변경 (결재/반려)
// ========================================
export const useUpdateExportStatus = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => supervisorApi.updateExportStatus(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPERVISOR_QUERY_KEYS.exportList });
      queryClient.invalidateQueries({ queryKey: SUPERVISOR_QUERY_KEYS.approvalList });
      queryClient.invalidateQueries({ queryKey: SUPERVISOR_QUERY_KEYS.dashboard });
    },
    ...options,
  });
};

// ========================================
// 통합 훅 — 페이지에서 사용하는 인터페이스
// ========================================
export const useSupervisorMutations = () => {
  const assignExportOfficerMutation = useAssignExportOfficer();
  const assignImportOfficerMutation = useAssignImportOfficer();
  const updateImportStatusMutation = useUpdateImportStatus();
  const updateExportStatusMutation = useUpdateExportStatus();

  return {
    // AssignmentOfficerPage에서 사용
    assignOfficer: {
      mutateAsync: async ({ declarationId, officerId, workType, reason }) => {
        if (workType === "EXPORT") {
          return await assignExportOfficerMutation.mutateAsync({
            exportId: declarationId,
            officerId,
          });
        } else {
          return await assignImportOfficerMutation.mutateAsync({
            importId: declarationId,
            officerId,
          });
        }
      },
      isPending: assignExportOfficerMutation.isPending || assignImportOfficerMutation.isPending,
    },

    // 결재 승인 (ESCALATED → ACCEPTED)
    approveDeclaration: {
      mutateAsync: async ({ declarationId, declType, comment, officerId }) => {
        if (declType === "EXPORT") {
          return await updateExportStatusMutation.mutateAsync({
            exportNumber: declarationId,
            status: "ACCEPTED",
            docComment: comment || "결재 승인",
            officerId: officerId || "",
          });
        } else {
          return await updateImportStatusMutation.mutateAsync({
            importNumber: declarationId,
            status: "ACCEPTED",
            docComment: comment || "결재 승인",
            officerId: officerId || "",
          });
        }
      },
      isPending: updateImportStatusMutation.isPending || updateExportStatusMutation.isPending,
    },

    // 결재 반려 (ESCALATED → REJECTED)
    rejectDeclaration: {
      mutateAsync: async ({ declarationId, declType, comment, reason, officerId }) => {
        if (declType === "EXPORT") {
          return await updateExportStatusMutation.mutateAsync({
            exportNumber: declarationId,
            status: "REJECTED",
            docComment: comment || reason || "결재 반려",
            officerId: officerId || "",
          });
        } else {
          return await updateImportStatusMutation.mutateAsync({
            importNumber: declarationId,
            status: "REJECTED",
            docComment: comment || reason || "결재 반려",
            officerId: officerId || "",
          });
        }
      },
      isPending: updateImportStatusMutation.isPending || updateExportStatusMutation.isPending,
    },

    // 사후 사건 배정 (mock — 백엔드 없음)
    assignPostCase: {
      mutateAsync: async () => {
        throw new Error("사후 사건 배정 API가 아직 구현되지 않았습니다.");
      },
      isPending: false,
    },
  };
};
