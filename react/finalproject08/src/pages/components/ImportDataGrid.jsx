import DataGrid from "../../style/components/DataGrid";
import Badge from "../../style/components/Badge";
import { RISK_COLORS } from "../../domain/customs/import/importConstants";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

// ⭐ 페이지네이션 컴포넌트 (외부로 분리)
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        title="첫 페이지"
      >
        <ChevronsLeft className="h-5 w-5" />
      </button>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        title="이전 페이지"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            px-3 py-1 rounded min-w-[32px]
            ${currentPage === page ? "bg-[#0f4c81] text-white font-semibold" : "hover:bg-gray-100 text-gray-700"}
          `}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        title="다음 페이지"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        title="마지막 페이지"
      >
        <ChevronsRight className="h-5 w-5" />
      </button>
    </div>
  );
};

//src/pages/components/ImportDataGrid.jsx
function ImportDataGrid({ declarations, isLoading, onRowClicked, currentPage, totalPages, pageSize, onPageChange }) {
  const UrgentBadgeRenderer = (props) => {
    if (props.value) {
      return (
        <div className="flex items-center justify-center h-full">
          <Badge variant="danger" className="w-14 justify-center">
            긴급
          </Badge>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center h-full">
        <Badge variant="outline" className="w-14 justify-center">
          일반
        </Badge>
      </div>
    );
  };

  const RiskBadgeRenderer = (params) => {
    const riskKey = params.value;
    const label = params.data.riskLevelLabel;
    const variant = RISK_COLORS[riskKey] || "outline";

    return (
      <div className="flex items-center justify-center h-full">
        <Badge variant={variant} className="w-14 justify-center">
          {label}
        </Badge>
      </div>
    );
  };

  const getRowId = (params) => {
    return params.data.declarationId;
  };

  const columnDefs = [
    {
      field: "declarationNumber",
      headerName: "신고번호",
      width: 190,
      headerClass: "ag-center-header",
      cellStyle: {
        headerClass: "ag-center-header",
        color: "#374151",
        fontWeight: "600",
        cursor: "pointer",
        textAlign: "center",
      },
    },
    {
      field: "statusLabel",
      headerName: "진행 상태",
      width: 120,
      headerClass: "ag-center-header",
      cellStyle: { textAlign: "center", color: "#374151", fontWeight: "600" },
    },
    {
      field: "isUrgent",
      headerName: "긴급",
      width: 80,
      headerClass: "ag-center-header",
      cellRenderer: UrgentBadgeRenderer,
      valueFormatter: (params) => {
        return params.value ? "긴급" : "";
      },
      cellStyle: (params) => {
        if (params.value) {
          return {
            fontWeight: "600",
            textAlign: "center",
          };
        }
        return { textAlign: "center" };
      },
    },
    {
      field: "itemName",
      headerName: "수입품명",
      flex: 1,
      minWidth: 150,
      headerClass: "ag-center-header",
      cellStyle: {
        textAlign: "center",
        color: "#374151",
        fontWeight: "600",
      },
    },
    {
      field: "declarationDate",
      headerName: "신고일자",
      width: 160,
      headerClass: "ag-center-header",
      cellStyle: {
        color: "#374151",
        fontWeight: "600",
        textAlign: "center",
      },
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
      field: "assignedOfficer",
      headerName: "담당자",
      width: 100,
      headerClass: "ag-center-header",
      valueFormatter: (params) => {
        return params.value || "미배정";
      },
      cellStyle: (params) => {
        if (!params.value) {
          return { color: "#374151" };
        }
        return { textAlign: "center", fontWeight: "600" };
      },
    },
    {
      field: "totalTaxAmountFormatted",
      headerName: "세액(원)",
      width: 130,
      headerClass: "ag-center-header",
      cellStyle: {
        textAlign: "center",
        fontWeight: "600",
        paddingRight: "16px",
      },
    },
    {
      field: "aiScore",
      headerName: "서류 점수",
      width: 109,
      headerClass: "ag-center-header",
      valueFormatter: (params) => (params.value ? `${params.value}점` : "-"),
      cellStyle: (params) => {
        const score = params.value;
        let color = "#374151";

        if (score >= 80) color = "#059669";
        else if (score < 80 && score > 0) color = "#b91c1c";

        return { textAlign: "center", fontWeight: "700", color: color };
      },
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

  if (isLoading && declarations.length === 0) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded border border-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f4c81] mx-auto"></div>
          <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DataGrid
        rowData={declarations}
        colDefs={columnDefs}
        onRowClicked={onRowClicked}
        height="600px"
        loading={isLoading}
        getRowId={getRowId}
        pagination={false}
      />

      {/* ⭐ 커스텀 페이지네이션 */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}

export default ImportDataGrid;
