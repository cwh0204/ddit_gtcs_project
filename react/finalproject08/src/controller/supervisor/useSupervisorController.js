// src/controller/supervisor/useSupervisorController.js

import { useQuery } from "@tanstack/react-query";
import { supervisorApi, importStatusApi } from "../../api/supervisor/supervisorApi";
import { importApi } from "../../api/customs/import/importApi";
import { exportApi } from "../../api/customs/export/exportApi";
import { useAuth } from "../../hooks/useAuth";
import { importMapper } from "../../domain/customs/import/importMapper";
import { mapExportDeclarationDetailFromAPI } from "../../domain/customs/export/exportMapper";
import {
  APPROVAL_STATUS_LABELS,
  APPROVAL_STATUS_BADGE_VARIANTS,
  APPROVAL_DECISION_LABELS,
  APPROVAL_DECISION_BADGE_VARIANTS,
  RISK_CHANNEL_LABELS,
  RISK_CHANNEL_BADGE_VARIANTS,
} from "../../domain/supervisor/supervisorConstants";

// ========================================
// 쿼리 키 상수
// ========================================
export const SUPERVISOR_QUERY_KEYS = {
  importList: ["supervisor", "import", "list"],
  exportList: ["supervisor", "export", "list"],
  officerList: ["supervisor", "officers"],
  dashboard: ["supervisor", "dashboard"],
  approvalList: ["supervisor", "approval", "list"],
  approvalDetail: ["supervisor", "approval", "detail"],
  backlogStats: ["supervisor", "backlog"],
  slaViolations: ["supervisor", "sla"],
  exceptionSummary: ["supervisor", "exception"],
  postCaseQueue: ["supervisor", "postCase"],
  importStatusCounts: ["supervisor", "import", "statusCounts"],
};

// ========================================
// [실제 API] 수입 신고서 목록 조회
// ========================================
export const useImportList = (params = {}, options = {}) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...SUPERVISOR_QUERY_KEYS.importList, params],
    queryFn: () => supervisorApi.getImportList(params, user),
    enabled: !!user?.memId,
    staleTime: 30 * 1000,
    ...options,
  });
};

// ========================================
// [실제 API] 수출 신고서 목록 조회
// ========================================
export const useExportList = (params = {}, options = {}) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...SUPERVISOR_QUERY_KEYS.exportList, params],
    queryFn: () => supervisorApi.getExportList(params, user),
    enabled: !!user?.memId,
    staleTime: 30 * 1000,
    ...options,
  });
};

// ========================================
// [실제 API] 세관원 목록 + 업무 부하 조회
// ========================================
const officerSelectFn = (data) => {
  const MAX_LOAD = 30;
  if (!Array.isArray(data)) return [];
  return data.map((officer) => ({
    officerId: officer.memId,
    officerName: officer.memName,
    taskLoad: officer.currentWorkload ?? officer.taskLoad ?? 0,
    currentLoad: officer.currentWorkload ?? officer.taskLoad ?? 0,
    totalCapacity: MAX_LOAD,
    companyName: officer.companyName || "",
    email: officer.email || "",
    hpNo: officer.hpNo || "",
  }));
};

export const useAvailableOfficers = (params = {}, options = {}) => {
  const workType = params.workType || "IMPORT";

  const importQuery = useQuery({
    queryKey: [...SUPERVISOR_QUERY_KEYS.officerList, "IMPORT"],
    queryFn: () => supervisorApi.getImportOfficerList(),
    enabled: workType === "IMPORT" || workType === "ALL",
    staleTime: 60 * 1000,
    select: officerSelectFn,
    ...options,
  });

  const exportQuery = useQuery({
    queryKey: [...SUPERVISOR_QUERY_KEYS.officerList, "EXPORT"],
    queryFn: () => supervisorApi.getExportOfficerList(),
    enabled: workType === "EXPORT",
    staleTime: 60 * 1000,
    select: officerSelectFn,
    ...options,
  });

  if (workType === "EXPORT") {
    return {
      ...exportQuery,
      data: exportQuery.data ?? [],
      isLoading: exportQuery.isLoading,
    };
  }

  return {
    ...importQuery,
    data: importQuery.data ?? [],
    isLoading: importQuery.isLoading,
  };
};

// ========================================
// [프론트 집계] workType별 세관원 업무 부하 계산
// ========================================
export const calcOfficerLoadFromList = (officerBase = [], declarationList = []) => {
  if (!Array.isArray(officerBase) || !Array.isArray(declarationList)) return officerBase;

  const loadMap = declarationList.reduce((acc, item) => {
    const id = item.currentOfficerId;
    if (id) acc[String(id)] = (acc[String(id)] ?? 0) + 1;
    return acc;
  }, {});

  return officerBase.map((officer) => ({
    ...officer,
    taskLoad: loadMap[String(officer.officerId)] ?? 0,
    currentLoad: loadMap[String(officer.officerId)] ?? 0,
  }));
};

// ========================================
// [실제 API] 수입 신고서 상태별 건수 조회
// ========================================
export const useImportStatusCounts = (options = {}) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: SUPERVISOR_QUERY_KEYS.importStatusCounts,
    queryFn: () => importStatusApi.getStatusCounts(),
    enabled: !!user?.memId,
    staleTime: 30 * 1000,
    select: (data) => {
      if (!Array.isArray(data)) return {};
      return data.reduce((acc, item) => {
        acc[item.status] = Number(item.count);
        return acc;
      }, {});
    },
    ...options,
  });
};

// ========================================
// [실제 API 기반] 배정 대기 목록 (수입/수출 통합)
// ========================================
export const useAssignmentQueue = (params = {}) => {
  const { user } = useAuth();
  const workType = params.workType || "ALL";

  const importQuery = useImportList({ amount: 9999 }, { enabled: workType === "ALL" || workType === "IMPORT" });
  const exportQuery = useExportList({ amount: 9999 }, { enabled: workType === "ALL" || workType === "EXPORT" });

  const statusCountsQuery = useImportStatusCounts({
    enabled: workType === "ALL" || workType === "IMPORT",
  });

  const isLoading = importQuery.isLoading || exportQuery.isLoading;
  const isError = importQuery.isError || exportQuery.isError;
  const error = importQuery.error || exportQuery.error;

  const data = (() => {
    const importList =
      workType === "EXPORT"
        ? []
        : (Array.isArray(importQuery.data) ? importQuery.data : []).map((item) => ({
            declarationId: item.importId || item.importNumber,
            declNo: item.importNumber || "-",
            workType: "IMPORT",
            priority: "MEDIUM",
            currentOfficerName: item.officer?.memName || null,
            currentOfficerId: item.officerId || null,
            receivedAt: item.importDate || item.regDate || "-",
            status: item.status,
            itemName: item.itemNameDeclared || item.goodsNm || item.goodsName || "-",
          }));

    const exportList =
      workType === "IMPORT"
        ? []
        : (Array.isArray(exportQuery.data) ? exportQuery.data : []).map((item) => ({
            declarationId: item.exportId || item.exportNumber,
            declNo: item.exportNumber || "-",
            workType: "EXPORT",
            priority: "MEDIUM",
            currentOfficerName: item.officer?.memName || item.member?.memName || item.officerName || null,
            currentOfficerId: item.officerId || null,
            receivedAt: item.exportDate || item.regDate || "-",
            status: item.status,
            itemName: item.itemNameDeclared || item.goodsNm || item.goodsName || "-",
          }));

    return [...importList, ...exportList];
  })();

  const EXCLUDED_STATUSES = ["DELIVERED", "CLEARED", "BONDED_IN"];
  const filteredData = data.filter((item) => !EXCLUDED_STATUSES.includes(item.status));
  const totalCount = filteredData.length;

  const statusCounts = (() => {
    if (workType === "EXPORT") {
      return filteredData.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] ?? 0) + 1;
        return acc;
      }, {});
    }
    if (workType === "IMPORT") {
      const raw = statusCountsQuery.data ?? {};
      return Object.fromEntries(Object.entries(raw).filter(([status]) => !EXCLUDED_STATUSES.includes(status)));
    }
    const importCounts = Object.fromEntries(Object.entries(statusCountsQuery.data ?? {}).filter(([status]) => !EXCLUDED_STATUSES.includes(status)));
    const exportCounts = filteredData
      .filter((item) => item.workType === "EXPORT")
      .reduce((acc, item) => {
        acc[item.status] = (acc[item.status] ?? 0) + 1;
        return acc;
      }, {});
    const merged = { ...importCounts };
    Object.entries(exportCounts).forEach(([status, count]) => {
      merged[status] = (merged[status] ?? 0) + count;
    });
    return merged;
  })();

  const refetch = () => {
    importQuery.refetch();
    exportQuery.refetch();
    statusCountsQuery.refetch();
  };

  return { data: filteredData, totalCount, statusCounts, isLoading, isError, error, refetch };
};

// ========================================
// [실제 API 기반] 대시보드 KPI
// ========================================
export const useSupervisorDashboard = (options = {}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: SUPERVISOR_QUERY_KEYS.dashboard,
    queryFn: async () => {
      const [importData, exportData, overallStats, monitoringStats] = await Promise.all([
        supervisorApi.getImportList({}, user),
        supervisorApi.getExportList({}, user),
        supervisorApi.getOverallStats().catch(() => null),
        supervisorApi.getMonitoringStats("ALL").catch(() => null),
      ]);

      const EXCLUDED_FROM_APPROVAL = ["DELIVERED", "CLEARED", "BONDED_IN"];
      const importList = (Array.isArray(importData) ? importData : []).filter((d) => !EXCLUDED_FROM_APPROVAL.includes(d.status));
      const exportList = (Array.isArray(exportData) ? exportData : []).filter((d) => !EXCLUDED_FROM_APPROVAL.includes(d.status));
      const allList = [...importList, ...exportList];

      const pendingCount = allList.filter((d) => d.status === "ESCALATED" || d.status === "WAITING" || d.status === "REVIEWING").length;
      const approvedCount = allList.filter((d) => d.status === "APPROVED" || d.status === "ACCEPTED").length;
      const rejectedCount = allList.filter((d) => d.status === "REJECTED").length;

      const channelDistribution = { GREEN: 0, DOC: 0, RED: 0, ANALYSIS: 0 };
      allList.forEach((d) => {
        const ai = d.aiDocCheck || d.aiRiskCheck || {};
        const riskResult = ai.riskResult || "";
        const riskScore = Number(ai.riskScore ?? 0);
        if (riskResult === "RED" || riskScore >= 80) channelDistribution.RED++;
        else if (riskScore >= 50) channelDistribution.ANALYSIS++;
        else if (riskScore >= 20 || riskResult === "DOC") channelDistribution.DOC++;
        else channelDistribution.GREEN++;
      });

      const importStats = {
        total: importList.length,
        pending: importList.filter((d) => ["WAITING", "REVIEWING", "ESCALATED", "PHYSICAL", "SUPPLEMENT"].includes(d.status)).length,
        approved: importList.filter((d) => ["APPROVED", "ACCEPTED", "CLEARED"].includes(d.status)).length,
      };

      const exportStats = {
        total: exportList.length,
        pending: exportList.filter((d) => ["WAITING", "REVIEWING", "ESCALATED", "PHYSICAL", "SUPPLEMENT"].includes(d.status)).length,
        approved: exportList.filter((d) => ["APPROVED", "ACCEPTED", "CLEARED"].includes(d.status)).length,
      };

      const recentApprovals = allList.slice(0, 5).map((d, i) => {
        const isImport = !!d.importNumber || d.declType === "IMPORT";
        const status = d.status || "WAITING";
        const ai = d.aiDocCheck || d.aiRiskCheck || {};
        return {
          approvalId: d.importId || d.exportId || d.approvalId || i,
          declNo: d.importNumber || d.exportNumber || d.declNo || "-",
          declType: isImport ? "IMPORT" : "EXPORT",
          declTypeLabel: isImport ? "수입" : "수출",
          approvalTypeLabel: d.approvalType ? APPROVAL_STATUS_LABELS[d.approvalType] || d.approvalType : "일반 결재",
          approvalTypeBadge: "outline",
          requestedByName: d.officerName || d.member?.memName || d.repName || "-",
          requestedAt: d.regDate || d.importDate || d.exportDate || "-",
          riskScore: Number(ai.riskScore ?? ai.score ?? -1) >= 0 ? (ai.riskScore ?? ai.score) : "-",
          statusLabel: APPROVAL_STATUS_LABELS[status] || status,
          statusBadge: APPROVAL_STATUS_BADGE_VARIANTS[status] || "warning",
        };
      });

      return {
        pendingApprovalCount: pendingCount,
        slaDelayedCount: monitoringStats?.over ?? 0,
        highRiskCount: channelDistribution.RED,
        todayApprovedCount: approvedCount,
        todayRejectedCount: rejectedCount,
        channelDistribution,
        importStats,
        exportStats,
        recentApprovals,
        overallStats: overallStats || null,
      };
    },
    enabled: !!user?.memId,
    staleTime: 60 * 1000,
    ...options,
  });
};

// ========================================
// [실제 API 기반] 결재 목록
// ========================================
export const useApprovalList = (params = {}, options = {}) => {
  const { user } = useAuth();
  const { declType, status, urgentOnly, approvalType } = params;

  return useQuery({
    queryKey: [...SUPERVISOR_QUERY_KEYS.approvalList, params],
    queryFn: async () => {
      let list = [];

      const apiParams = { amount: 100, pageNum: 1 };

      if (declType === "EXPORT") {
        list = await supervisorApi.getExportList(apiParams, user);
      } else if (declType === "IMPORT") {
        list = await supervisorApi.getImportList(apiParams, user);
      } else {
        const [imp, exp] = await Promise.all([supervisorApi.getImportList(apiParams, user), supervisorApi.getExportList(apiParams, user)]);
        const importArr = (Array.isArray(imp) ? imp : []).map((d) => ({ ...d, _declType: "IMPORT" }));
        const exportArr = (Array.isArray(exp) ? exp : []).map((d) => ({ ...d, _declType: "EXPORT" }));
        list = [...importArr, ...exportArr];
      }

      if (!Array.isArray(list)) list = [];

      if (status === "COMPLETED") {
        list = list.filter((d) => ["ACCEPTED", "REJECTED"].includes(d.status));
      } else {
        list = list.filter((d) => d.status === "ESCALATED");
      }

      const items = list.map((d) => {
        const isImport = !!d.importNumber || d._declType === "IMPORT";
        const declNo = d.importNumber || d.exportNumber || "-";
        const channel = d.aiDocCheck?.riskResult || d.riskResult || null;
        return {
          ...d,
          approvalId: isImport ? `IMPORT:${d.importId}` : `EXPORT:${d.exportId}`,
          declNo,
          declType: isImport ? "IMPORT" : "EXPORT",
          declTypeLabel: isImport ? "수입" : "수출",
          status: d.status,
          statusLabel: APPROVAL_DECISION_LABELS[d.status] || APPROVAL_STATUS_LABELS[d.status] || d.status,
          statusBadge: APPROVAL_DECISION_BADGE_VARIANTS[d.status] || APPROVAL_STATUS_BADGE_VARIANTS[d.status] || "outline",
          requestedByName: d.officer?.memName || d.member?.memName || "-",
          requestedAt: d.submitDate || d.regDate || "-",
          amountFormatted: d.totalTaxBase ? `${Number(d.totalTaxBase).toLocaleString()}원` : "-",
          riskScore: d.aiDocCheck?.riskScore ?? d.riskScore ?? "-",
          channelLabel: channel ? RISK_CHANNEL_LABELS[channel] || channel : "-",
          channelBadge: channel ? RISK_CHANNEL_BADGE_VARIANTS[channel] || "default" : "default",
          approvalTypeLabel: "일반 결재",
          approvalTypeBadge: "outline",
        };
      });

      return { items, totalCount: items.length };
    },
    enabled: !!user?.memId,
    staleTime: 30 * 1000,
    ...options,
  });
};

// ========================================
// [실제 API 기반] 결재 상세
// ⭐ 핵심 변경: importMapper.toDetailModel / mapExportDeclarationDetailFromAPI 적용
//    → ApprovalListPage의 탭 컴포넌트가 기대하는 구조로 변환
// ========================================
export const useApprovalDetail = (approvalId, options = {}) => {
  const { user } = useAuth();

  const isImportId = typeof approvalId === "string" && approvalId.startsWith("IMPORT:");
  const isExportId = typeof approvalId === "string" && approvalId.startsWith("EXPORT:");
  const rawId = isImportId ? approvalId.replace("IMPORT:", "") : isExportId ? approvalId.replace("EXPORT:", "") : approvalId;

  return useQuery({
    queryKey: [...SUPERVISOR_QUERY_KEYS.approvalDetail, approvalId],
    queryFn: async () => {
      let raw = null;
      let isImport = false;

      if (isExportId) {
        raw = await exportApi.getDetail(rawId, user);
        isImport = false;
      } else if (isImportId) {
        raw = await importApi.getDetail(rawId, user);
        isImport = true;
      } else {
        try {
          raw = await importApi.getDetail(rawId, user);
          isImport = true;
        } catch {
          raw = await exportApi.getDetail(rawId, user);
          isImport = false;
        }
      }

      if (!raw) return null;

      // ⭐ mapper 적용 → 탭 컴포넌트가 기대하는 중첩 구조로 변환
      const mapped = isImport ? importMapper.toDetailModel(raw) : mapExportDeclarationDetailFromAPI(raw);

      const declNo = raw.importNumber || raw.exportNumber || "-";
      const channel = raw.aiDocCheck?.riskResult || raw.riskResult || null;

      // ⭐ 목록에서 가져온 메타 정보 + mapper가 만든 상세 구조를 병합
      return {
        // ── mapper 변환 결과 (탭 컴포넌트용 구조) ──
        ...mapped,

        // ── 결재 메타 정보 (드로어 헤더/요약용) ──
        _declType: isImport ? "IMPORT" : "EXPORT",
        approvalId: raw.importId || raw.exportId,
        declNo,
        declType: isImport ? "IMPORT" : "EXPORT",
        declTypeLabel: isImport ? "수입" : "수출",
        status: raw.status,
        statusLabel: APPROVAL_STATUS_LABELS[raw.status] || raw.status,
        statusBadge: APPROVAL_STATUS_BADGE_VARIANTS[raw.status] || "outline",
        requestedByName: raw.officer?.memName || raw.member?.memName || "-",
        requestedAt: raw.submitDate || raw.regDate || "-",
        amountFormatted: raw.totalTaxBase ? `${Number(raw.totalTaxBase).toLocaleString()}원` : "-",
        riskScore: raw.aiDocCheck?.riskScore ?? raw.riskScore ?? "-",
        channelLabel: channel ? RISK_CHANNEL_LABELS[channel] || channel : "-",
        channelBadge: channel ? RISK_CHANNEL_BADGE_VARIANTS[channel] || "default" : "default",
        approvalTypeLabel: "일반 결재",
        approvalTypeBadge: "outline",

        // ── importNumber / exportNumber 보존 (mutateAsync 시 사용) ──
        importNumber: raw.importNumber,
        exportNumber: raw.exportNumber,
        officerId: raw.officerId,
      };
    },
    enabled: !!approvalId && !!user?.memId,
    staleTime: 30 * 1000,
    ...options,
  });
};

// ========================================
// [프론트 집계] 적체/지연 모니터링
// ========================================
export const useBacklogStats = (params = {}, options = {}) => {
  const { user } = useAuth();
  const declType = params.declType || "ALL";

  const importQuery = useQuery({
    queryKey: [...SUPERVISOR_QUERY_KEYS.importList, { amount: 9999 }],
    queryFn: () => supervisorApi.getImportList({ amount: 9999 }, user),
    enabled: !!user?.memId && (declType === "ALL" || declType === "IMPORT"),
    staleTime: 60 * 1000,
  });

  const exportQuery = useQuery({
    queryKey: [...SUPERVISOR_QUERY_KEYS.exportList, { amount: 9999 }],
    queryFn: () => supervisorApi.getExportList({ amount: 9999 }, user),
    enabled: !!user?.memId && (declType === "ALL" || declType === "EXPORT"),
    staleTime: 60 * 1000,
  });

  const isLoading = importQuery.isLoading || exportQuery.isLoading;
  const isError = importQuery.isError || exportQuery.isError;

  const importList = Array.isArray(importQuery.data) ? importQuery.data : [];
  const exportList = Array.isArray(exportQuery.data) ? exportQuery.data : [];

  const targetList = (() => {
    if (declType === "IMPORT") return importList.map((d) => ({ ...d, _declType: "IMPORT" }));
    if (declType === "EXPORT") return exportList.map((d) => ({ ...d, _declType: "EXPORT" }));
    return [...importList.map((d) => ({ ...d, _declType: "IMPORT" })), ...exportList.map((d) => ({ ...d, _declType: "EXPORT" }))];
  })();

  const EXCLUDED = ["DELIVERED", "CLEARED", "BONDED_IN"];
  const activeList = targetList.filter((d) => !EXCLUDED.includes(d.status));

  const now = new Date();
  const SLA_DAYS = 3;
  const MAX_DAYS = 7;

  const toElapsedDays = (d) => {
    const date = d.submitDate || d.regDate || d.importDate || d.exportDate;
    if (!date) return 0;
    return Math.floor((now - new Date(date)) / (1000 * 60 * 60 * 24));
  };

  const slaViolatedList = activeList.filter((d) => d.delayYn === "Y" || toElapsedDays(d) > SLA_DAYS);
  const totalBacklog = activeList.length;
  const slaViolationCount = slaViolatedList.length;
  const delayRate = totalBacklog > 0 ? Math.round((slaViolationCount / totalBacklog) * 100) : 0;

  const avgProcessingDays = (() => {
    if (activeList.length === 0) return null;
    const total = activeList.reduce((sum, d) => sum + toElapsedDays(d), 0);
    return Math.round((total / activeList.length) * 10) / 10;
  })();

  const within7Rate = (() => {
    if (activeList.length === 0) return 0;
    const within = activeList.filter((d) => toElapsedDays(d) <= MAX_DAYS).length;
    return Math.round((within / activeList.length) * 100);
  })();

  const stages = activeList.reduce((acc, d) => {
    const key = STAGE_KEY_MAP[d.status] || "ETC";
    if (!acc[key]) acc[key] = { count: 0 };
    acc[key].count += 1;
    return acc;
  }, {});

  const violations = slaViolatedList
    .map((d) => {
      const isImport = d._declType === "IMPORT";
      const declNo = d.importNumber || d.exportNumber || "-";
      const elapsedDays = toElapsedDays(d);
      const remainDays = MAX_DAYS - elapsedDays;
      const stage = STAGE_KEY_MAP[d.status] || d.status;
      const ai = d.aiDocCheck || {};
      const riskScore = Number(ai.riskScore ?? 0);
      const isRed = riskScore >= 50;

      return {
        ...d,
        declNo,
        declType: isImport ? "IMPORT" : "EXPORT",
        itemName: d.itemNameDeclared || d.goodsNm || d.goodsName || "-",
        stage,
        officerName: d.officer?.memName || d.member?.memName || d.officerName || d.assignedOfficer || "-",
        receivedAt: d.submitDate || d.regDate || d.importDate || d.exportDate || "-",
        aiScore: ai.docScore ?? null,
        riskScore,
        riskLevel: isRed ? "RED" : "GREEN",
        riskLevelLabel: isRed ? "RED" : "GREEN",
        elapsedDays,
        remainDays,
        isSlaViolation: true,
      };
    })
    .sort((a, b) => a.remainDays - b.remainDays);

  return {
    data: { totalBacklog, slaViolationCount, delayRate, avgProcessingDays, within7Rate, stages, violations },
    isLoading,
    isError,
    refetch: () => {
      importQuery.refetch();
      exportQuery.refetch();
    },
  };
};

const STAGE_KEY_MAP = {
  WAITING: "RECEPTION",
  REVIEWING: "DOC_REVIEW",
  PHYSICAL: "PHYSICAL_INSPECT",
  INSPECTION: "PHYSICAL_INSPECT",
  INSPECTION_COMPLETED: "PHYSICAL_INSPECT",
  PAY_WAITING: "TAX_REVIEW",
  ACCEPTED: "TAX_REVIEW",
  RELEASE_APPROVED: "RELEASE",
  SUPPLEMENT: "DOC_REVIEW",
  ESCALATED: "DOC_REVIEW",
};

// ========================================
// [프론트 집계] SLA 초과 목록
// ========================================
export const useSlaViolations = (params = {}, options = {}) => {
  const backlog = useBacklogStats(params, options);
  return {
    data: backlog.data?.violations ?? [],
    isLoading: backlog.isLoading,
    isError: backlog.isError,
    refetch: backlog.refetch,
  };
};

// ========================================
// [Mock] 예외승인/차단해제
// ========================================
export const useExceptionSummary = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [...SUPERVISOR_QUERY_KEYS.exceptionSummary, params],
    queryFn: async () => ({
      exceptionApprovedCount: 3,
      blockReleasedCount: 2,
      blockMaintainedCount: 1,
      conditionalApprovedCount: 0,
      importExceptionCount: 2,
      importBlockReleaseCount: 1,
      exportExceptionCount: 1,
      exportBlockReleaseCount: 1,
      reasonDistribution: {
        URGENT_CARGO: 2,
        DOC_SUPPLEMENT: 1,
        SUPERVISOR_OVERRIDE: 1,
      },
      history: [],
    }),
    staleTime: 60 * 1000,
    ...options,
  });
};

// ========================================
// [Mock] 사후 사건 배정
// ========================================
export const usePostCaseQueue = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [...SUPERVISOR_QUERY_KEYS.postCaseQueue, params],
    queryFn: async () => [],
    staleTime: 60 * 1000,
    ...options,
  });
};
