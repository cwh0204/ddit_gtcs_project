// src/controller/custom/board/useCommentHooks.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "../../../api/customs/board/commentApi";

/**
 * 댓글 통합 Hook
 * @param {number|string} bdId - 게시글 ID
 */
export const useComments = (bdId) => {
  const queryClient = useQueryClient();
  const queryKey = ["comment", "list", bdId];

  // 댓글 목록 조회
  const { data: comments, isLoading } = useQuery({
    queryKey,
    queryFn: () => commentApi.getList(bdId),
    enabled: !!bdId,
    staleTime: 30 * 1000,
  });

  // 캐시 무효화
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  // 댓글 등록
  const createComment = useMutation({
    mutationFn: (data) => commentApi.create(data),
    onSuccess: (result) => {
      if (result === "Y") {
        invalidate();
      } else {
        alert("댓글 등록에 실패했습니다.");
      }
    },
    onError: () => {
      alert("댓글 등록 중 오류가 발생했습니다.");
    },
  });

  // 댓글 수정
  const updateComment = useMutation({
    mutationFn: (data) => commentApi.update(data),
    onSuccess: (result) => {
      if (result === "Y") {
        invalidate();
      } else {
        alert("수정 권한이 없습니다.");
      }
    },
    onError: () => {
      alert("댓글 수정 중 오류가 발생했습니다.");
    },
  });

  // 댓글 삭제
  const deleteComment = useMutation({
    mutationFn: (reId) => commentApi.delete(reId),
    onSuccess: (result) => {
      if (result === "Y") {
        invalidate();
      } else {
        alert("삭제 권한이 없습니다.");
      }
    },
    onError: () => {
      alert("댓글 삭제 중 오류가 발생했습니다.");
    },
  });

  return {
    comments: comments || [],
    isLoading,
    createComment,
    updateComment,
    deleteComment,
  };
};
