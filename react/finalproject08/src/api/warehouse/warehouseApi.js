import apiClient from "../axios.instance";

// src/api/warehouse/warehouseApi.js

export const warehouseApi = {
  createCargoEntry: async (data, file = null) => {
    const formData = new FormData();

    const jsonBlob = new Blob(
      [
        JSON.stringify({
          uniqueNo: data.uniqueNo,
          itemName: data.itemName,
          qty: data.qty,
          grossWeight: data.grossWeight,
          warehouseId: data.warehouseId,
          positionArea: data.positionArea,
          repName: data.repName || null,
          declNo: data.declNo || null,
          damagedYn: data.damagedYn || "N",
          damagedComment: data.damagedComment || null,
          entryDate: data.inboundDate || null,
          outDate: data.expectedOutboundDate || null,
        }),
      ],
      { type: "application/json" },
    );

    formData.append("data", jsonBlob);

    if (file) {
      formData.append("warehouseFile", file);
    }

    const response = await apiClient.post("/rest/warehouse", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  findCargoByLocation: async (contNumber, positionArea) => {
    const response = await apiClient.get("/rest/warehouse/locate", {
      params: {
        contNo: contNumber,
        positionArea: positionArea,
      },
    });

    return response.data;
  },

  getCargoDetail: async (stockId) => {
    const response = await apiClient.get(`/rest/warehouse/${stockId}`);
    return response.data;
  },

  getCargoList: async (filters = {}) => {
    const { cargoType = "import" } = filters;

    const response = await apiClient.get("/rest/warehouse/list", {
      params: { cargoType },
    });

    return response.data;
  },

  updateCargoLocation: async (stockId, newWarehouseId, newPositionArea) => {
    const response = await apiClient.put("/rest/warehouse/locate", {
      stockId: stockId,
      warehouseId: newWarehouseId,
      positionArea: newPositionArea,
    });
    return response.data;
  },

  // 검사 관리 API

  updateImportInspectionStatus: async (importNumber, data) => {
    const response = await apiClient.put("/rest/import/whmangercheck", {
      importNumber: importNumber,
      status: data.status,
    });
    return response.data;
  },

  /**
   * 수출 검사 완료 처리
   */
  updateExportInspectionStatus: async (exportNumber, data) => {
    const response = await apiClient.put("/rest/export/warehouse/inspection", {
      exportNumber: exportNumber,
      status: data.status,
    });
    return response.data;
  },

  getAreaCount: async (positionArea) => {
    const response = await apiClient.get(`/rest/warehouse/area/count/${positionArea}`);
    return response.data;
  },

  /**
   * 컨테이너 번호로 화물 검색 (findCargoByLocation 래퍼)
   */
  getCargoByContainerNumber: async (contNumber, positionArea) => {
    const response = await apiClient.get("/rest/warehouse/locate", {
      params: { contNo: contNumber, positionArea: positionArea },
    });
    return response.data;
  },

  /**
   * 화물입고등록수정
   */
  updateWarehouseStock: async (data) => {
    const response = await apiClient.put("/rest/warehouse", data);
    return response.data;
  },
};

export default warehouseApi;
