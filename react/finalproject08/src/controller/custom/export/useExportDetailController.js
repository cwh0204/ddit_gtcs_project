// src/controller/customs/export/useExportDetailController.js

import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { mapExportDeclarationDetailFromAPI } from "../../../domain/customs/export/exportMapper";
import { exportApi } from "../../../api/customs/export/exportApi";

/**
 * 수출신고서 상세 조회 Controller
 * declarationId와 id 모두 지원
 */
export const useExportDetailController = (exportId) => {
  const params = useParams();
  const { user } = useAuth();
  const actualId = exportId || params.declarationId || params.id;
  const {
    data: rawData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["exportDeclaration", actualId],
    queryFn: () => exportApi.getDetail(actualId, user),
    enabled: !!actualId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const declaration = rawData ? mapExportDeclarationDetailFromAPI(rawData) : null;

  return {
    declaration,
    rawData,
    isLoading,
    error,
    refetch,
  };
};

export default useExportDetailController;
