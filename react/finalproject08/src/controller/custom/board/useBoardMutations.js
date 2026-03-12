// src/controller/customs/board/useBoardMutations.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boardApi } from "../../../api/customs/board/boardApi";

/**
 * 게시판 Mutation Hooks (쓰기)
 */

export const useBoardMutations = () => {
  const queryClient = useQueryClient();

  // 캐시 무효화 헬퍼
  const invalidateCache = () => {
    queryClient.invalidateQueries({ queryKey: ["board"] });
  };

  // 등록
  const createBoard = useMutation({
    mutationFn: (data) => boardApi.create(data),
    onSuccess: (result) => {
      if (result === "success") {
        invalidateCache();
      } else if (result === "unauthorized") {
        throw new Error("권한이 없습니다.");
      } else if (result === "fail") {
        throw new Error("등록에 실패했습니다.");
      }
    },
    onError: (error) => {
      console.error("[createBoard] 실패:", error);
    },
  });

  // 수정
  const updateBoard = useMutation({
    mutationFn: (data) => boardApi.update(data),
    onSuccess: (result) => {
      if (result === "Y") {
        invalidateCache();
      } else if (result === "N") {
        throw new Error("수정 권한이 없습니다.");
      }
    },
    onError: (error) => {
      console.error("[updateBoard] 실패:", error);
    },
  });

  // 삭제
  const deleteBoard = useMutation({
    mutationFn: (bdId) => boardApi.delete(bdId),
    onSuccess: (result) => {
      if (result === "Y") {
        invalidateCache();
      } else if (result === "N") {
        throw new Error("삭제 권한이 없습니다.");
      }
    },
    onError: (error) => {
      console.error("[deleteBoard] 실패:", error);
    },
  });

  return {
    createBoard: {
      mutate: createBoard.mutate,
      mutateAsync: createBoard.mutateAsync,
      isPending: createBoard.isPending,
      isError: createBoard.isError,
      error: createBoard.error,
    },
    updateBoard: {
      mutate: updateBoard.mutate,
      mutateAsync: updateBoard.mutateAsync,
      isPending: updateBoard.isPending,
      isError: updateBoard.isError,
      error: updateBoard.error,
    },
    deleteBoard: {
      mutate: deleteBoard.mutate,
      mutateAsync: deleteBoard.mutateAsync,
      isPending: deleteBoard.isPending,
      isError: deleteBoard.isError,
      error: deleteBoard.error,
    },
  };
};

export default useBoardMutations;
