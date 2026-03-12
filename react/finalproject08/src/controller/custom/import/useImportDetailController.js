/**
 * src/controller/custom/import/useImportDetailController.js
 * 수입신고서 상세 조회 커스텀 훅
 */

import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { importApi } from "../../../api/customs/import/importApi";
import { importMapper } from "../../../domain/customs/import/importMapper";
import { useAuth } from "../../../hooks/useAuth";

/**
 * 수입신고서 상세 조회 Hook
 */
export const useImportDetailController = () => {
  const { declarationId } = useParams();
  const { user } = useAuth();

  const {
    data: rawData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["importDeclaration", declarationId],

    queryFn: async () => {
      const response = await importApi.getDetail(declarationId, user);

      let data = null;

      if (response?.data) {
        data = response.data;
      } else if (response && typeof response === "object") {
        data = response;
      } else {
        return null;
      }

      return data;
    },

    enabled: !!declarationId && !!user,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const declaration = rawData ? importMapper.toDetailModel(rawData) : null;

  return {
    declaration,
    isLoading,
    error,
    refetch,
  };
};

export default useImportDetailController;
