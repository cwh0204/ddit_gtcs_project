// src/api/customs/board/commentApi.js

import apiClient from "../../axios.instance";

export const commentApi = {
  getList: async (bdId) => {
    const response = await apiClient.get("/rest/comment/cmtList", {
      params: { bdId },
    });
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post("/rest/comment/createCmt", data);
    return response.data;
  },

  update: async (data) => {
    const response = await apiClient.put("/rest/comment/cmtModify", data);
    return response.data;
  },

  delete: async (reId) => {
    const response = await apiClient.delete("/rest/comment/cmtDelete", {
      params: { reId },
    });
    return response.data;
  },
};
