// src/api/customs/cargo/cargoApi.js

import apiClient from "../../axios.instance";

export const cargoApi = {
  async getList(filters = {}) {
    const { cargoType = "import" } = filters;
    const response = await apiClient.get("/rest/warehouse/list", {
      params: { cargoType },
    });
    return response.data;
  },

  async getDetail(stockId) {
    const response = await apiClient.get(`/rest/warehouse/${stockId}`);
    return response.data;
  },
};

export default cargoApi;
