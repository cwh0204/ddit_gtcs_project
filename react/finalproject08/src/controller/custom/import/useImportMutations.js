//src/controller/custom/import/useImportMutations.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importApi } from "../../../api/customs/import/importApi";
import { QUERY_KEYS } from "../../../constants/common/queryKeys";
import { useAuth } from "../../../hooks/useAuth";
import toast from "react-hot-toast";

export const useImportMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const invalidateCache = (id) => {
    queryClient.invalidateQueries({ queryKey: ["importDeclarations"] });
    if (id) {
      queryClient.invalidateQueries({ queryKey: ["importDeclaration", id] });
    }
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  // ✅ 창고 쪽 캐시 삭제 (세관원 액션 후 창고관리자 화면 즉시 반영)
  const invalidateWarehouseCache = () => {
    queryClient.removeQueries({ queryKey: QUERY_KEYS.warehouse.cargos.all() });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.warehouse.inspections.all() });
  };

  const startInspection = useMutation({
    mutationFn: ({ id, importNumber, checkId, officerId, officerName }) =>
      importApi.startInspection(id, {
        importNumber,
        status: "INSPECTION",
        docComment: "현품검사 요청",
        checkId,
        officerId,
        officerName,
      }),
    onSuccess: (data, variables) => {
      invalidateCache(variables.id);
      invalidateWarehouseCache(); // ✅ 창고 캐시 삭제
      toast.success("현품검사가 요청되었습니다.");
    },
    onError: () => {
      toast.error("현품검사 요청에 실패했습니다.");
    },
  });

  const requestSupplement = useMutation({
    mutationFn: ({ id, importNumber, docComment, checkId, officerId, officerName }) =>
      importApi.requestSupplement(id, {
        importNumber,
        docComment,
        checkId,
        officerId,
        officerName,
      }),
    onSuccess: (data, variables) => {
      invalidateCache(variables.id);
      invalidateWarehouseCache(); // ✅ 창고 캐시 삭제
      toast.success("보완 요구가 전송되었습니다.");
    },
    onError: () => {
      toast.error("보완 요구에 실패했습니다.");
    },
  });

  const requestCorrection = useMutation({
    mutationFn: ({ id, importNumber, docComment, checkId, officerId, officerName }) =>
      importApi.requestCorrection(id, {
        importNumber,
        docComment,
        checkId,
        officerId,
        officerName,
      }),
    onSuccess: (data, variables) => {
      invalidateCache(variables.id);
      invalidateWarehouseCache(); // ✅ 창고 캐시 삭제
      toast.success("정정 요구가 전송되었습니다.");
    },
    onError: () => {
      toast.error("정정 요구에 실패했습니다.");
    },
  });

  const completeInspection = useMutation({
    mutationFn: ({ id, importNumber, docComment, checkId, result, officerId, officerName }) =>
      importApi.completeInspection(id, {
        importNumber,
        docComment,
        checkId,
        result,
        officerId,
        officerName,
      }),
    onSuccess: (data, variables) => {
      invalidateCache(variables.id);
      invalidateWarehouseCache(); // ✅ 창고 캐시 삭제
      toast.success("검사가 완료되었습니다.");
    },
    onError: () => {
      toast.error("검사 완료 처리에 실패했습니다.");
    },
  });

  const rejectDeclaration = useMutation({
    mutationFn: ({ id, importNumber, docComment, checkId, officerId, officerName }) =>
      importApi.rejectDeclaration(id, {
        importNumber,
        docComment,
        checkId,
        officerId,
        officerName,
      }),
    onSuccess: (data, variables) => {
      invalidateCache(variables.id);
      invalidateWarehouseCache(); // ✅ 창고 캐시 삭제
      toast.success("반려 처리되었습니다.");
    },
    onError: () => {
      toast.error("반려 처리에 실패했습니다.");
    },
  });

  /**
   * 승인 (ACCEPTED → 백엔드에서 자동으로 고지서 생성)
   */
  const approveDeclaration = useMutation({
    mutationFn: async ({ id, importNumber, docComment, checkId }) => {
      const officerId = user?.memId ? String(user.memId) : null;
      const officerName = user?.name || null;

      if (!officerId) {
        throw new Error("담당자 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
      }

      const approveResult = await importApi.approveWithPayWaiting(id, {
        importNumber,
        docComment,
        checkId,
        officerId,
        officerName,
      });

      return { approveResult };
    },
    onSuccess: (data, variables) => {
      invalidateCache(variables.id);
      invalidateWarehouseCache(); // ✅ 창고 캐시 삭제
      toast.success("수리(승인)되었습니다. 세액 고지서가 발송되었습니다.");
    },
    onError: () => {
      toast.error("승인 처리에 실패했습니다.");
    },
  });

  /**
   * 통관승인 (PAY_COMPLETED → APPROVED)
   */
  const finalApproval = useMutation({
    mutationFn: ({ id, importNumber, docComment, checkId, officerId, officerName }) =>
      importApi.finalApproval(id, {
        importNumber,
        status: "APPROVED",
        docComment,
        checkId,
        officerId,
        officerName,
      }),
    onSuccess: (data, variables) => {
      invalidateCache(variables.id);
      invalidateWarehouseCache(); // ✅ 창고 캐시 삭제
      toast.success("통관승인이 완료되었습니다.");
    },
    onError: () => {
      toast.error("통관승인 처리에 실패했습니다.");
    },
  });

  /**
   * 상급자 결재 요청 (ESCALATED)
   */
  const escalateToSupervisor = useMutation({
    mutationFn: ({ id, importNumber, docComment, checkId, officerId }) =>
      importApi.escalate(id, {
        importNumber,
        docComment,
        checkId,
        officerId,
      }),
    onSuccess: (data, variables) => {
      invalidateCache(variables.id);
      invalidateWarehouseCache(); // ✅ 창고 캐시 삭제
      toast.success("상급자에게 결재 요청이 전송되었습니다.");
    },
    onError: () => {
      toast.error("결재 요청에 실패했습니다.");
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
    escalateToSupervisor: {
      mutate: escalateToSupervisor.mutate,
      isPending: escalateToSupervisor.isPending || false,
      isError: escalateToSupervisor.isError || false,
      error: escalateToSupervisor.error || null,
    },
  };
};

export default useImportMutations;
