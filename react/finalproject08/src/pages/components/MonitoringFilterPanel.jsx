// src/pages/components/MonitoringFilterPanel.jsx

import { useState } from "react";
import { Search } from "lucide-react";
import Card from "../../style/components/Card";
import Input from "../../style/components/Input";
import Button from "../../style/components/Button";
import Select from "../../style/components/form/Select";
import { PERIOD_OPTIONS } from "../../domain/supervisor/supervisorConstants";

const REMAIN_DAY_OPTIONS = [
  { value: "", label: "전체" },
  { value: "0", label: "기한 초과" },
  { value: "1", label: "D-1 이내" },
  { value: "2", label: "D-2 이내" },
  { value: "3", label: "D-3 이내" },
];

const SLA_OPTIONS = [
  { value: "", label: "전체" },
  { value: "true", label: "SLA 초과" },
  { value: "false", label: "정상" },
];

function MonitoringFilterPanel({ filters = {}, onFilterChange, onSearch, onReset, hideCard = false }) {
  const [local, setLocal] = useState({
    period: filters.period ?? "today",
    remainDays: filters.remainDays ?? "",
    isSlaViolation: filters.isSlaViolation ?? "",
    search: filters.search ?? "",
    startDate: filters.startDate ?? "",
    endDate: filters.endDate ?? "",
  });

  const handleChange = (key, value) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    Object.keys(local).forEach((key) => onFilterChange(key, local[key]));
    onSearch();
  };

  const handleReset = () => {
    const reset = { period: "today", remainDays: "", isSlaViolation: "", search: "", startDate: "", endDate: "" };
    setLocal(reset);
    onReset();
  };

  const rows = (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2 flex-shrink-0">
        <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">기간 :</label>
        <Select value={local.period} onChange={(e) => handleChange("period", e.target.value)} className="w-32">
          {PERIOD_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">접수일 :</label>
        <div className="flex items-center gap-1">
          <Input
            type="date"
            value={local.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className="w-32"
            max={local.endDate}
          />
          <span className="text-gray-400">~</span>
          <Input type="date" value={local.endDate} onChange={(e) => handleChange("endDate", e.target.value)} className="w-32" min={local.startDate} />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">남은 일수 :</label>
        <Select value={local.remainDays} onChange={(e) => handleChange("remainDays", e.target.value)} className="w-28">
          {REMAIN_DAY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">검색 :</label>
        <Input
          type="text"
          placeholder="신고번호, 담당자명"
          value={local.search}
          onChange={(e) => handleChange("search", e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="w-52"
        />
      </div>

      <div className="flex gap-2 flex-shrink-0">
        <Button size="sm" onClick={handleSearch}>
          <Search className="h-4 w-4 mr-1" />
          검색
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset}>
          초기화
        </Button>
      </div>
    </div>
  );

  if (hideCard) {
    return rows;
  }

  return (
    <Card>
      <div className="p-4">{rows}</div>
    </Card>
  );
}

export default MonitoringFilterPanel;
