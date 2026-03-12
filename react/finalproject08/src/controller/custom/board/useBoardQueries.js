// src/controller/customs/board/useBoardQueries.js

import { useQuery } from "@tanstack/react-query";
import { boardApi } from "../../../api/customs/board/boardApi";

/**
 * 게시판 Query Hooks (읽기 전용)
 */

/**
 * 게시판 목록 조회
 * @param {Object} params - { bdType, startDate, endDate, searchType, keyword }
 */
export const useBoardList = (params = {}) => {
  return useQuery({
    queryKey: ["board", "list", params],
    queryFn: () => boardApi.getList(params),
    staleTime: 30 * 1000, // 30초
  });
};

/**
 * 게시판 상세 조회
 * @param {number} bdId - 게시글 ID
 */
export const useBoardDetail = (bdId) => {
  return useQuery({
    queryKey: ["board", "detail", bdId],
    queryFn: () => boardApi.getDetail(bdId),
    staleTime: 60 * 1000, // 1분
    enabled: !!bdId,
  });
};
