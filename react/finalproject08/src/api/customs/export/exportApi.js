// src/api/customs/export/exportApi.js

import apiClient from "../../axios.instance";

export const exportApi = {
  async getList(params = {}, userInfo) {
    const apiParams = {
      memId: userInfo?.memId,
      status: params.status || "ALL",
      memRole: userInfo?.memRole || "OFFICER",
      pageNum: params.pageNum || 1,
      amount: params.amount || 15,
      type: params.type || null,
      keyword: params.keyword || params.search || null,
    };

    if (params.startDate) apiParams.startDate = params.startDate;
    if (params.endDate) apiParams.endDate = params.endDate;

    const response = await apiClient.get("/rest/export", {
      params: apiParams,
    });

    return response.data;
  },

  async getDetail(id, userInfo) {
    const response = await apiClient.get(`/rest/export/${id}`, {
      params: {
        memRole: userInfo?.memRole || "OFFICER",
      },
    });
    return response.data;
  },

  async create(data, files = {}) {
    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));

    if (files.invoiceFile) formData.append("invoiceFile", files.invoiceFile);
    if (files.packinglistFile) formData.append("packinglistFile", files.packinglistFile);
    if (files.blFile) formData.append("blFile", files.blFile);
    if (files.otherFile) formData.append("otherFile", files.otherFile);

    const response = await apiClient.post("/rest/export", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  async startInspection(id, data) {
    const response = await apiClient.put("/rest/export/warehouse/inspection", {
      exportNumber: data.exportNumber,
      status: "PHYSICAL",
    });
    return response.data;
  },

  async completeInspection(id, data) {
    const response = await apiClient.put("/rest/export/warehouse/inspection", {
      exportNumber: data.exportNumber,
      status: "INSPECTION_COMPLETED",
    });
    return response.data;
  },

  async requestSupplement(id, data) {
    const response = await apiClient.post("/rest/export/feedback", null, {
      params: {
        exportNumber: data.exportNumber,
        status: "SUPPLEMENT",
        docComment: data.docComment,
        checkId: data.checkId ? String(data.checkId) : "",
      },
    });
    return response.data;
  },

  async requestCorrection(id, data) {
    const response = await apiClient.post("/rest/export/feedback", null, {
      params: {
        exportNumber: data.exportNumber,
        status: "SUPPLEMENT",
        docComment: data.docComment,
        checkId: data.checkId ? String(data.checkId) : "",
      },
    });
    return response.data;
  },

  async rejectDeclaration(id, data) {
    const response = await apiClient.post("/rest/export/feedback", null, {
      params: {
        exportNumber: data.exportNumber,
        status: "REJECTED",
        docComment: data.docComment,
        checkId: data.checkId ? String(data.checkId) : "",
      },
    });
    return response.data;
  },

  async approve(id, data) {
    const response = await apiClient.post("/rest/export/feedback", null, {
      params: {
        exportNumber: data.exportNumber,
        status: "ACCEPTED",
        docComment: data.docComment || data.comment || "승인 처리",
        checkId: data.checkId ? String(data.checkId) : "",
      },
    });
    return response.data;
  },

  async approveWithPayWaiting(id, data) {
    const response = await apiClient.post("/rest/export/feedback", null, {
      params: {
        exportNumber: data.exportNumber,
        status: "ACCEPTED",
        docComment: data.docComment || "수리 처리",
        checkId: data.checkId ? String(data.checkId) : "",
      },
    });
    return response.data;
  },

  // 통관승인 - RELEASE_APPROVED → APPROVED
  async finalApproval(id, data) {
    const response = await apiClient.post("/rest/export/feedback", null, {
      params: {
        exportNumber: data.exportNumber,
        status: "APPROVED",
        docComment: data.docComment || "통관승인",
        checkId: data.checkId ? String(data.checkId) : "",
      },
    });
    return response.data;
  },

  async autoApproveHighScore(id, data = {}) {
    return await this.approveWithPayWaiting(id, {
      exportNumber: data.exportNumber,
      docComment: data.docComment || `AI 자동 승인 (점수: ${data.docScore || "95-100"})`,
      checkId: data.checkId,
    });
  },
};
