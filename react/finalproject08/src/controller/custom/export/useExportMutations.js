// src/controller/customs/export/useExportMutations.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { exportApi } from "../../../api/customs/export/exportApi";
import { useAuth } from "../../../hooks/useAuth";
import toast from "react-hot-toast";

export const useExportMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const invalidateCache = (id) => {
    queryClient.invalidateQueries({ queryKey: ["exportDeclarations"] });
    if (id) {
      queryClient.invalidateQueries({ queryKey: ["exportDeclaration", id] });
    }
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["warehouse"] });
    queryClient.invalidateQueries({ queryKey: ["cargos"] });
  };

  const startInspection = useMutation({
    mutationFn: ({ id, exportNumber, checkId }) => exportApi.startInspection(id, { exportNumber, checkId }),
    onSuccess: (data, variables) => {
      invalidateCache(variables.id);
      toast.success("검사 요청이 창고관리자에게 전달되었습니다.");
    },
    onError: () => {
      toast.error("검사 요청에 실패했습니다.");
    },
  });

  const requestSupplement = useMutation({
    mutationFn: ({ id, exportNumber, docComment, checkId }) => exportApi.requestSupplement(id, { exportNumber, docComment, checkId }),
    onSuccess: (data, variables) => {
      invalidateCache(variables.id);
      toast.success("보완 요구가 전송되었습니다.");
    },
    onError: () => {
      toast.error("보완 요구에 실패했습니다.");
    },
  });

  const requestCorrection = useMutation({
    mutationFn: ({ id, exportNumber, docComment, checkId }) => exportApi.requestCorrection(id, { exportNumber, docComment, checkId }),
    onSuccess: (data, variables) => {
      invalidateCache(variables.id);
      toast.success("정정 요구가 전송되었습니다.");
    },
    onError: () => {
      toast.error("정정 요구에 실패했습니다.");
    },
  });

  const completeInspection = useMutation({
    mutationFn: ({ id, exportNumber, docComment, checkId }) => exportApi.completeInspection(id, { exportNumber, docComment, checkId }),
    onSuccess: (data, variables) => {
      invalidateCache(variables.id);
      toast.success("검사가 완료되었습니다.");
    },
    onError: () => {
      toast.error("검사 완료 처리에 실패했습니다.");
    },
  });

  const rejectDeclaration = useMutation({
    mutationFn: ({ id, exportNumber, docComment, checkId }) => exportApi.rejectDeclaration(id, { exportNumber, docComment, checkId }),
    onSuccess: (data, variables) => {
      invalidateCache(variables.id);
      toast.success("반려 처리되었습니다.");
    },
    onError: () => {
      toast.error("반려 처리에 실패했습니다.");
    },
  });

  const approveDeclaration = useMutation({
    mutationFn: async ({ id, exportNumber, docComment, checkId }) => {
      const approveResult = await exportApi.approveWithPayWaiting(id, {
        exportNumber,
        docComment,
        checkId,
      });
      return { approveResult };
    },
    onSuccess: (data, variables) => {
      invalidateCache(variables.id);
      toast.success("수리(승인)되었습니다.");
    },
    onError: () => {
      toast.error("승인 처리에 실패했습니다.");
    },
  });

  const finalApproval = useMutation({
    mutationFn: ({ id, exportNumber, docComment, checkId }) => exportApi.finalApproval(id, { exportNumber, docComment, checkId }),
    onSuccess: (data, variables) => {
      invalidateCache(variables.id);
      toast.success("통관승인이 완료되었습니다.");
    },
    onError: () => {
      toast.error("통관승인 처리에 실패했습니다.");
    },
  });

  return {
    startInspection: {
      mutate: startInspection.mutate,
      isPending: startInspection.isPending || false,
      isError: startInspection.isError || false,
      error: startInspection.error || null,
    },
    requestSupplement: {
      mutate: requestSupplement.mutate,
      isPending: requestSupplement.isPending || false,
      isError: requestSupplement.isError || false,
      error: requestSupplement.error || null,
    },
    requestCorrection: {
      mutate: requestCorrection.mutate,
      isPending: requestCorrection.isPending || false,
      isError: requestCorrection.isError || false,
      error: requestCorrection.error || null,
    },
    completeInspection: {
      mutate: completeInspection.mutate,
      isPending: completeInspection.isPending || false,
      isError: completeInspection.isError || false,
      error: completeInspection.error || null,
    },
    rejectDeclaration: {
      mutate: rejectDeclaration.mutate,
      isPending: rejectDeclaration.isPending || false,
      isError: rejectDeclaration.isError || false,
      error: rejectDeclaration.error || null,
    },
    approveDeclaration: {
      mutate: approveDeclaration.mutate,
      isPending: approveDeclaration.isPending || false,
      isError: approveDeclaration.isError || false,
      error: approveDeclaration.error || null,
    },
    finalApproval: {
      mutate: finalApproval.mutate,
      isPending: finalApproval.isPending || false,
      isError: finalApproval.isError || false,
      error: finalApproval.error || null,
    },
  };
};

export default useExportMutations;
