import DataGrid from "../../style/components/DataGrid";
import Badge from "../../style/components/Badge";
import { STATUS_BADGE_VARIANTS } from "../../domain/warehouse/warehouseConstants";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

// src/pages/components/CargoDataGrid.jsx

// ⭐ Pagination 컴포넌트 (함수 외부 선언 - React 규칙)
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-4 pb-4">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="첫 페이지"
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="이전 페이지"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {getPageNumbers().map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-3 py-2">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded ${currentPage === page ? "bg-[#0f4c81] text-white font-semibold" : "hover:bg-gray-100 text-gray-700"}`}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="다음 페이지"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="마지막 페이지"
      >
        <ChevronsRight className="h-4 w-4" />
      </button>
    </div>
  );
};

function CargoDataGrid({ cargos, isLoading, onRowClicked, currentPage, totalPages, pageSize, onPageChange }) {
  const UrgentBadgeRenderer = (props) => {
    if (!props.value) return null;
    return (
      <div className="flex items-center justify-center h-full">
        <Badge variant="danger">긴급</Badge>
      </div>
    );
  };

  const RiskBadgeRenderer = (params) => {
    const data = params.data;
    if (!data) return null;
    const isRed = data.dwellTime > 168 || data.isOverdue;
    return (
      <div className="flex items-center justify-center h-full">
        <Badge variant={isRed ? "danger" : "success"} className="w-14 justify-center">
          {isRed ? "RED" : "GREEN"}
        </Badge>
      </div>
    );
  };

  const DeclarationStatusRenderer = (params) => {
    const data = params.data;
    if (!data) return null;
    const { declarationStatus, declarationStatusLabel } = data;
    if (!declarationStatus || declarationStatusLabel === "-") {
      return <span className="text-gray-400 text-sm">-</span>;
    }
    return (
      <div className="flex items-center justify-center h-full">
        <Badge variant={STATUS_BADGE_VARIANTS[declarationStatus] || "outline"}>{declarationStatusLabel}</Badge>
      </div>
    );
  };

  const StorageLocationRenderer = (params) => {
    const data = params.data;
    if (!data) return null;
    const { positionArea } = data;

    if (positionArea === "BONDED") {
      return (
        <div className="flex items-center justify-center h-full">
          <Badge variant="primary">보세창고</Badge>
        </div>
      );
    }
    if (positionArea === "LOCAL") {
      return (
        <div className="flex items-center justify-center h-full">
          <Badge variant="success">국내창고</Badge>
        </div>
      );
    }
    return <span className="text-gray-400 text-sm">-</span>;
  };

  const DamagedStatusRenderer = (params) => {
    const isDamaged = params.value && params.value !== "N";
    return (
      <div className="flex items-center justify-center h-full">
        <Badge variant={isDamaged ? "danger" : "success"}>{isDamaged ? "손상" : "정상"}</Badge>
      </div>
    );
  };

  const getRowId = (params) => params.data.id || params.data.stockId || params.data.containerId;

  const columnDefs = [
    {
      field: "containerId",
      headerName: "컨테이너 ID",
      width: 150,
      headerClass: "ag-center-header",
      cellStyle: { color: "#374151", fontWeight: "600", cursor: "pointer", textAlign: "center" },
    },
    {
      field: "positionArea",
      headerName: "보관장소",
      width: 120,
      headerClass: "ag-center-header",
      cellRenderer: StorageLocationRenderer,
      cellStyle: { textAlign: "center" },
    },
    {
      field: "declarationStatusLabel",
      headerName: "신고서 상태",
      width: 130,
      headerClass: "ag-center-header",
      cellRenderer: DeclarationStatusRenderer,
      cellStyle: { textAlign: "center" },
    },
    {
      field: "isUrgent",
      headerName: "긴급",
      width: 80,
      headerClass: "ag-center-header",
      cellRenderer: UrgentBadgeRenderer,
      valueGetter: (params) => params.data?.dwellTime > 168,
      cellStyle: (params) => ({ fontWeight: params.value ? "600" : undefined, textAlign: "center" }),
    },
    {
      field: "itemName",
      headerName: "품목명",
      flex: 1,
      minWidth: 150,
      headerClass: "ag-center-header",
      cellStyle: { textAlign: "center", color: "#374151", fontWeight: "600" },
    },
    {
      field: "owner",
      headerName: "기업명",
      width: 150,
      headerClass: "ag-center-header",
      cellStyle: { textAlign: "center", color: "#374151", fontWeight: "600" },
    },
    {
      field: "inboundDate",
      headerName: "입고등록일자",
      width: 160,
      headerClass: "ag-center-header",
      cellStyle: { color: "#374151", fontWeight: "600", textAlign: "center" },
      valueFormatter: (params) => {
        if (!params.value) return "-";
        try {
          const date = new Date(params.value);
          if (isNaN(date.getTime())) return "-";
          return date
            .toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\.$/, "");
        } catch {
          return "-";
        }
      },
    },
    {
      field: "zone",
      headerName: "구역",
      width: 100,
      headerClass: "ag-center-header",
      cellStyle: { textAlign: "center", fontWeight: "600", color: "#374151" },
    },
    {
      field: "damagedYn",
      headerName: "파손여부",
      width: 100,
      headerClass: "ag-center-header",
      cellRenderer: DamagedStatusRenderer,
      cellStyle: { textAlign: "center" },
    },
    {
      field: "riskLevel",
      headerName: "위험도",
      width: 100,
      headerClass: "ag-center-header",
      cellRenderer: RiskBadgeRenderer,
      cellStyle: { textAlign: "center" },
    },
  ];

  if (isLoading && (!cargos || cargos.length === 0)) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded border border-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f4c81] mx-auto" />
          <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DataGrid
        rowData={cargos}
        colDefs={columnDefs}
        onRowClicked={onRowClicked}
        height="600px"
        loading={isLoading}
        getRowId={getRowId}
        pagination={false}
        suppressPaginationPanel={true}
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}

export default CargoDataGrid;
