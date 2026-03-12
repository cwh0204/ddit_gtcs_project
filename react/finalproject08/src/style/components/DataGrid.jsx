// src/style/components/DataGrid.jsx
//AG-Grid Wrapper (getRowId 지원 추가)

import { AgGridReact } from "ag-grid-react";
import { cn } from "../utils";
import { useMemo } from "react";

const gridStyle = `ag-theme-alpine font-sans text-sm
  [&_.ag-header]:bg-gray-50 
  [&_.ag-header]:border-b-gray-200 
  [&_.ag-header]:h-12
  [&_.ag-header-cell-text]:text-gray-600 
  [&_.ag-header-cell-text]:font-semibold
  [&_.ag-row]:border-b-gray-100
  [&_.ag-row-hover]:bg-blue-50/50
  [&_.ag-cell]:flex 
  [&_.ag-cell]:items-center 
  [&_.ag-cell]:text-gray-700
  [&_.ag-root-wrapper]:border-none
`;

function DataGrid({ className, rowData, colDefs, height = "600px", isEditable = false, onRowClicked, loading = false, getRowId, ...props }) {
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      headerClass: "flex items-center",
      editable: isEditable,
    }),
    [isEditable],
  );

  // 높이 보장 (최소 500px)
  const safeHeight = height || "700px";

  return (
    <div
      className={cn("w-full rounded-lg overflow-hidden border border-gray-200 bg-white", gridStyle, className)}
      style={{
        height: safeHeight,
        minHeight: "500px",
      }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        onRowClicked={onRowClicked}
        pagination={false}
        paginationPageSize={10}
        rowHeight={48}
        headerHeight={48}
        animateRows={true}
        rowSelection="multiple"
        suppressCellFocus={true}
        loading={loading}
        domLayout="normal"
        getRowId={getRowId}
        {...props}
      />
    </div>
  );
}

export default DataGrid;
