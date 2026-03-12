// src/api/supervisor/supervisorApi.js

import apiClient from "../axios.instance";
import { importApi } from "../customs/import/importApi";
import { exportApi } from "../customs/export/exportApi";

export const supervisorApi = {
  async getImportList(params = {}, userInfo) {
    const supervisorUserInfo = {
      ...userInfo,
      memRole: "SUPERVISOR",
    };
    try {
      const result = await importApi.getList(params, supervisorUserInfo);
      return result;
    } catch (err) {
      return [];
    }
  },

  async getExportList(params = {}, userInfo) {
    const supervisorUserInfo = {
      ...userInfo,
      memRole: "SUPERVISOR",
    };
    return await exportApi.getList(params, supervisorUserInfo);
  },

  async getOfficerList() {
    const response = await apiClient.get("/rest/import/officers/workload");
    return response.data;
  },

  async getImportOfficerList() {
    const response = await apiClient.get("/rest/import/officers/workload");
    return response.data;
  },

  async getExportOfficerList() {
    const response = await apiClient.get("/rest/import/officers/workload");
    return response.data;
  },

  async assignImportOfficer(body = {}) {
    const response = await apiClient.put(`/rest/import/${body.importId}/assign`, { officerId: body.officerId });
    return response.data;
  },

  async assignExportOfficer(body = {}) {
    const response = await apiClient.put("/rest/export/officer", {
      exportId: body.exportId,
      officerId: body.officerId,
    });
    return response.data;
  },

  async updateImportStatus(body = {}) {
    const response = await apiClient.post("/rest/import/feedback", {
      importNumber: body.importNumber,
      status: body.status,
      docComment: body.docComment || "",
      checkId: body.checkId || "",
      officerId: body.officerId || "",
    });
    return response.data;
  },

  async updateExportStatus(body = {}) {
    const response = await apiClient.post("/rest/export/feedback", null, {
      params: {
        exportNumber: body.exportNumber,
        status: body.status,
        docComment: body.docComment || "",
        checkId: body.checkId || "",
      },
    });
    return response.data;
  },

  async getMonitoringStats(declType = "ALL") {
    const response = await apiClient.get("/api/supervisor/monitoring/stats", {
      params: { declType },
    });
    return response.data;
  },

  async getMonitoringViolations(declType = "ALL") {
    const response = await apiClient.get("/api/supervisor/monitoring/violations", {
      params: { declType },
    });
    return response.data;
  },

  async getOverallStats() {
    const response = await apiClient.get("/api/supervisor/monitoring/overall-stats");
    return response.data;
  },
};

export default supervisorApi;

// ========================================
// 통계 API
// ========================================
export const statisticsApi = {
  async getZoneInspectionStats({ startDate, endDate, declType } = {}) {
    const response = await apiClient.get("/rest/statistics/zone-inspection", {
      params: { startDate, endDate, declType },
    });
    return response.data;
  },

  async getWarehouseShareStats({ startDate, endDate, declType } = {}) {
    const response = await apiClient.get("/rest/statistics/warehouse-share", {
      params: { startDate, endDate, declType },
    });
    return response.data;
  },

  async getLogDashboardStats({ startDate, endDate, declType } = {}) {
    const response = await apiClient.get("/rest/statistics/dashboard/log-stats", {
      params: { startDate, endDate, declType },
    });
    return response.data;
  },

  async getMasterDashboardStats({ startDate, endDate, declType } = {}) {
    const response = await apiClient.get("/rest/statistics/dashboard/master-stats", {
      params: { startDate, endDate, declType },
    });
    return response.data;
  },

  /**
   * AI 위험도 및 SLA 통계
   * GET /rest/statistics/dashboard/sla-stats
   */
  async getSlaStats({ startDate, endDate, declType } = {}) {
    const response = await apiClient.get("/rest/statistics/dashboard/sla-stats", {
      params: { startDate, endDate, declType },
    });
    return response.data;
  },
};

// ========================================
// 수입 신고서 상태별 카운트 API
// ========================================
export const importStatusApi = {
  async getStatusCounts() {
    const response = await apiClient.get("/rest/import/status-counts");
    return response.data;
  },
};
