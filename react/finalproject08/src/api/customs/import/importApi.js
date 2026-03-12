// src/api/customs/import/importApi.js
import apiClient from "../../axios.instance";

export const importApi = {
  // 수입 조회 API (페이징 지원)
  async getList(params = {}, userInfo) {
    const apiParams = {
      status: params.status || "ALL",
      pageNum: params.pageNum || 1,
      amount: params.amount || 10,
    };

    if (userInfo?.memId) {
      apiParams.memId = userInfo.memId;
    }
    if (userInfo?.memRole) {
      apiParams.memRole = userInfo.memRole;
    }

    if (params.startDate) {
      apiParams.startDate = params.startDate;
    }
    if (params.endDate) {
      apiParams.endDate = params.endDate;
    }

    const response = await apiClient.get("/rest/import", {
      params: apiParams,
    });

    return response.data;
  },

  async getDetail(id, userInfo) {
    const apiParams = {};

    if (userInfo?.memRole) {
      apiParams.memRole = userInfo.memRole;
    }

    const response = await apiClient.get(`/rest/import/${id}`, {
      params: apiParams,
    });

    return response.data;
  },

  // 등록 API (Multipart FormData)
  async create(data, files = {}) {
    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));

    if (files.invoiceFile) formData.append("invoiceFile", files.invoiceFile);
    if (files.packinglistFile) formData.append("packinglistFile", files.packinglistFile);
    if (files.blFile) formData.append("blFile", files.blFile);
    if (files.otherFile) formData.append("otherFile", files.otherFile);

    const response = await apiClient.post("/rest/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // 상태 변경 API (jsonbody 형식)
  async startInspection(id, data) {
    const response = await apiClient.post(`/rest/import/feedback`, {
      importNumber: data.importNumber,
      status: "PHYSICAL",
      docComment: data.docComment || "검사를 시작합니다",
      checkId: data.checkId ? String(data.checkId) : "",
    });
    return response.data;
  },

  async completeInspection(id, data) {
    const response = await apiClient.post(`/rest/import/feedback`, {
      importNumber: data.importNumber,
      status: "INSPECTION_COMPLETED",
      docComment: data.docComment,
      checkId: data.checkId ? String(data.checkId) : "",
    });
    return response.data;
  },

  async clearance(id, data) {
    await apiClient.post(`/rest/import/feedback`, {
      importNumber: data.importNumber,
      status: "CLEARED",
      docComment: data.docComment || "수리 처리 완료",
      checkId: data.checkId ? String(data.checkId) : "",
    });

    return await this.issueNotice(id, data);
  },

  async approve(id, data) {
    const response = await apiClient.post(`/rest/import/feedback`, {
      importNumber: data.importNumber,
      status: "PAY_WAITING",
      docComment: data.docComment || "승인 처리",
      checkId: data.checkId ? String(data.checkId) : "",
      officerId: data.officerId,
    });
    return response.data;
  },

  async requestSupplement(id, data) {
    const response = await apiClient.post(`/rest/import/feedback`, {
      importNumber: data.importNumber,
      status: "SUPPLEMENT",
      docComment: data.docComment,
      checkId: data.checkId ? String(data.checkId) : "",
    });
    return response.data;
  },

  async requestCorrection(id, data) {
    const response = await apiClient.post(`/rest/import/feedback`, {
      importNumber: data.importNumber,
      status: "SUPPLEMENT",
      docComment: data.docComment,
      checkId: data.checkId ? String(data.checkId) : "",
    });
    return response.data;
  },

  async rejectDeclaration(id, data) {
    const response = await apiClient.post(`/rest/import/feedback`, {
      importNumber: data.importNumber,
      status: "REJECTED",
      docComment: data.docComment,
      checkId: data.checkId ? String(data.checkId) : "",
    });
    return response.data;
  },

  async issueNotice(id, data) {
    const response = await apiClient.post(`/rest/import/feedback`, {
      importNumber: data.importNumber,
      status: "NOTICE_ISSUED",
      docComment: data.docComment || "고지서 발송 완료",
      checkId: data.checkId ? String(data.checkId) : "",
    });
    return response.data;
  },

  async autoApproveHighScore(id, data = {}) {
    await this.approve(id, {
      importNumber: data.importNumber,
      docComment: data.docComment || `AI 자동 승인 (점수: ${data.docScore || "95-100"})`,
      checkId: data.checkId,
    });

    return await this.issueNotice(id, {
      importNumber: data.importNumber,
      checkId: data.checkId,
    });
  },

  async approveWithPayWaiting(id, data) {
    const response = await apiClient.post("/rest/import/feedback", {
      importNumber: data.importNumber,
      status: "ACCEPTED",
      docComment: data.docComment || "수리 처리",
      checkId: data.checkId ? String(data.checkId) : "",
      officerId: data.officerId ? String(data.officerId) : "",
    });

    return response.data;
  },

  /**
   * 상급자 결재 요청 (ESCALATED)
   * 세관원이 상급자에게 결재를 요청할 때 사용
   */
  async escalate(id, data) {
    const response = await apiClient.post("/rest/import/feedback", {
      importNumber: data.importNumber,
      status: "ESCALATED",
      docComment: data.docComment || "상급자 결재 요청",
      checkId: data.checkId ? String(data.checkId) : "",
      officerId: data.officerId ? String(data.officerId) : "",
    });
    return response.data;
  },

  async finalApproval(id, data) {
    const response = await apiClient.post("/rest/import/feedback", {
      importNumber: data.importNumber,
      status: "APPROVED",
      docComment: data.docComment || "통관승인",
      checkId: data.checkId ? String(data.checkId) : "",
      officerId: data.officerId ? String(data.officerId) : "",
    });
    return response.data;
  },

  async generateTaxBill(importId, officerId) {
    const response = await apiClient.post("/rest/tax/generate", null, {
      params: {
        importId,
        officerId,
      },
    });
    return response.data;
  },
};
