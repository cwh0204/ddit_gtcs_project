// src/api/member/memberApi.js
import apiClient from "../axios.instance";

export const memberApi = {
  async getDetail(memId) {
    const response = await apiClient.get("/member/selectMem", {
      params: { memId },
    });
    return response.data;
  },

  async update(data) {
    const response = await apiClient.post("/member/updateMem", data);
    return response.data;
  },
};

export default memberApi;
