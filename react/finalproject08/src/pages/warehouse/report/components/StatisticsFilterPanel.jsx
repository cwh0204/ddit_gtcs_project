// src/pages/warehouse/report/components/StatisticsFilterPanel.jsx

import { useState } from "react";
import { Search } from "lucide-react";
import Card from "../../../../style/components/Card";
import Input from "../../../../style/components/Input";
import Button from "../../../../style/components/Button";

/**
 * 통계 페이지 공통 필터 패널
 * - 조회기간 (시작일 ~ 종료일)
 * - 검색어 (신고번호 등)
 * props:
 *   filters       : { startDate, endDate, search }
 *   onSearch(filters) : 조회 버튼 클릭 시 호출
 *   onReset()     : 초기화 버튼 클릭 시 호출
 *   searchPlaceholder : 검색 input placeholder
 */
function StatisticsFilterPanel({ filters = {}, onSearch, onReset }) {
  const [local, setLocal] = useState({
    startDate: filters.startDate ?? "",
    endDate: filters.endDate ?? "",
  });

  const handleChange = (key, value) => setLocal((prev) => ({ ...prev, [key]: value }));

  const handleSearch = () => {
    if (onSearch) onSearch(local);
  };

  const handleReset = () => {
    const reset = { startDate: "", endDate: "" };
    setLocal(reset);
    if (onReset) onReset(reset);
  };

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* 조회기간 */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">조회기간 :</label>
            <div className="flex items-center gap-1">
              <Input
                type="date"
                value={local.startDate}
                max={local.endDate || undefined}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-36"
              />
              <span className="text-gray-400">~</span>
              <Input
                type="date"
                value={local.endDate}
                min={local.startDate || undefined}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="w-36"
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSearch}>
              <Search className="h-4 w-4 mr-1" />
              조회
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              초기화
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default StatisticsFilterPanel;
