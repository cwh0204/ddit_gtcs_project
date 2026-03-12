import { useMemo } from "react";
import { STAT_CARD_CONFIGS } from "../domain/customs/import/importConstants";

//src/hooks/useImportStats.js
export function useImportStats(statusCounts = {}, urgentCount = 0) {
  const stats = useMemo(() => {
    const result = {}; //여기서 만든 객체가 아래에서 쓰이고 있다.

    STAT_CARD_CONFIGS.forEach((config) => {
      if (config.isUrgentCount) {
        result[config.key] = urgentCount;
      } else if (config.statusKey) {
        result[config.key] = statusCounts[config.statusKey] || 0;
      } else if (config.statusKeys) {
        result[config.key] = config.statusKeys.reduce((sum, statusKey) => sum + (statusCounts[statusKey] || 0), 0);
      }
    });
    return result;
  }, [statusCounts, urgentCount]);
  return stats;
}
