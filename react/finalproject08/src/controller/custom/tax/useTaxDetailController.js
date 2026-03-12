// src/controller/customs/tax/useTaxListController.js

import { useQuery } from "@tanstack/react-query";
import { getList } from "../../../api/customs/tax/taxApi";
import {
  mapTaxPaymentList,
  calculatePaymentStatusCounts,
  calculateTotalPaymentAmount,
  calculateUnpaidAmount,
} from "../../../domain/customs/tax/taxMapper";

/**
 * 세액/납부 목록 조회 Controller
 * ✅ taxMapper 기준
 */
export const useTaxListController = (filters, options = {}) => {
  const {
    data: rawData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["taxPayments", filters],

    queryFn: async () => {
      // 1️⃣ API에서 원본 데이터 가져오기
      const allData = await getList();

      // 2️⃣ 필터가 없으면 전체 반환
      if (!filters || Object.keys(filters).length === 0) {
        return allData;
      }

      // 3️⃣ 필터링 (DB Flat 구조 기준)
      let filtered = allData || [];

      // 상태 필터 (Application 레벨)
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          // ✅ 배열: PAYMENT_PENDING, PAYMENT_OVERDUE 등
          filtered = filtered.filter((item) => {
            const status = calculatePaymentStatus(item);
            return filters.status.includes(status);
          });
        } else {
          // ✅ 단일 값
          filtered = filtered.filter((item) => {
            const status = calculatePaymentStatus(item);
            return status === filters.status;
          });
        }
      }

      // 긴급 필터
      if (filters.isUrgent !== undefined) {
        filtered = filtered.filter((item) => {
          const isUrgent = item.isUrgent === true || item.isUrgent === "Y";
          return isUrgent === filters.isUrgent;
        });
      }

      // 담당자 필터
      if (filters.assignedOfficer) {
        filtered = filtered.filter((item) => item.assignedOfficer?.includes(filters.assignedOfficer));
      }

      // 검색 필터 (신고번호, 수입자명)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          (item) => item.importId?.toLowerCase().includes(searchLower) || item.importerName?.toLowerCase().includes(searchLower),
        );
      }

      return filtered;
    },

    enabled: options.enabled !== false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // 4️⃣ Mapper로 변환 (DB Flat → UI 구조)
  const declarations = rawData ? mapTaxPaymentList(rawData) : [];

  // 5️⃣ 집계 (원본 데이터 기준)
  const statusCounts = rawData ? calculatePaymentStatusCounts(rawData) : { total: 0 };
  const totalAmount = rawData ? calculateTotalPaymentAmount(rawData) : 0;
  const unpaidAmount = rawData ? calculateUnpaidAmount(rawData) : 0;
  const totalCount = statusCounts.total || 0;

  return {
    declarations, // ✅ Mapper 변환된 데이터
    statusCounts, // ✅ 상태별 건수
    totalAmount, // ✅ 총 납부액
    unpaidAmount, // ✅ 미납액
    totalCount, // ✅ 전체 건수
    isLoading,
    error,
    refetch,
  };
};

/**
 * Application 레벨 상태 계산 (Mapper와 동일)
 */
const calculatePaymentStatus = (data) => {
  if (data.payStatus === "PAID" || data.payDate) {
    return "PAYMENT_COMPLETED";
  }

  if (!data.issueDate) {
    return "UNPAID";
  }

  if (data.issueDate && !data.payDate) {
    const now = new Date();
    const dueDate = new Date(data.dueDate);

    if (now > dueDate) {
      return "PAYMENT_OVERDUE";
    }
    return "PAYMENT_PENDING";
  }

  return "UNPAID";
};
