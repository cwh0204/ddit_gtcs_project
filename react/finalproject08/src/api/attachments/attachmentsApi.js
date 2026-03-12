// src/api/attachments/attachmentsApi.js
import apiClient from "../axios.instance";

export const attachmentsApi = {
  download: async (fileId, fileName) => {
    try {
      // Blob으로 받기
      const response = await apiClient.get(`/download/${fileId}`, {
        responseType: "blob",
      });

      // Blob을 링크로 변환
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("파일 다운로드 실패:", error);
      throw error;
    }
  },
};

export default attachmentsApi;
