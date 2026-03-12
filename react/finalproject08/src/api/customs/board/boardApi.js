// src/api/customs/board/boardApi.js

import apiClient from "../../axios.instance";

export const boardApi = {
  getList: async (params = {}) => {
    const response = await apiClient.get("/rest/board/list", { params });
    return response.data;
  },

  getDetail: async (bdId) => {
    const response = await apiClient.get("/rest/board/detail", {
      params: { bdId },
    });
    return response.data;
  },

  create: async (data) => {
    const formData = new FormData();
    formData.append("bdType", data.bdType || "");
    formData.append("bdTitle", data.bdTitle || "");
    formData.append("bdCont", data.bdCont || "");
    formData.append("bdSecyn", data.bdSecyn || "N");

    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    const response = await apiClient.post("/rest/board/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  update: async (data) => {
    const formData = new FormData();

    formData.append("bdId", data.bdId);
    formData.append("bdTitle", data.bdTitle || "");
    formData.append("bdCont", data.bdCont || "");

    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    const response = await apiClient.put("/rest/board/modify", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  delete: async (bdId) => {
    const response = await apiClient.delete("/rest/board/delete", {
      params: { bdId },
    });
    return response.data;
  },

  /**
   * 조회수 증가
   * @param {number} bdId - 게시글 ID
   */
  increaseViewCount: async (bdId) => {
    const response = await apiClient.put("/rest/board/count", null, {
      params: { bdId },
    });
    return response.data;
  },
};
