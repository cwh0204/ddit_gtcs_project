import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import Card from "../../../style/components/Card";
import Button from "../../../style/components/Button";
import Input from "../../../style/components/Input";
import { Search, Plus, Loader2, AlertTriangle } from "lucide-react";
import { useBoardList } from "../../../controller/custom/board/useBoardQueries";

// src/pages/customs/support/NoticeListPage.jsx

/**
 * 공지사항 목록 페이지
 * ✅ API 연결 완료
 * ✅ 목 데이터 제거
 */

// bdType 매핑
const BD_TYPE_MAP = {
  notice: "공지사항",
  admin: "행정예고",
  inquiry: "민원사항",
};

function NoticeListPage({ type = "notice", basePath = "/customs/support/notice" }) {
  const navigate = useNavigate();

  // 필터 상태
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [keyword, setKeyword] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({});

  // ========== API 호출 ==========
  const bdType = BD_TYPE_MAP[type];
  const {
    data: boardList,
    isLoading,
    error,
  } = useBoardList({
    bdType,
    ...appliedFilters,
  });

  // ========== 필터링된 데이터 ==========
  const filteredData = useMemo(() => {
    if (!boardList) return [];
    return boardList;
  }, [boardList]);

  // getRowId 함수 (깜빡임 방지)
  const getRowId = (params) => {
    return params.data.bdId;
  };

  // ✅ 컬럼 정의
  const columnDefs = [
    {
      headerName: "번호",
      width: 80,
      headerClass: "ag-center-header",
      cellStyle: {
        textAlign: "center",
        color: "#374151",
        fontWeight: "600",
      },
      valueGetter: (params) => {
        // 전체 데이터 길이 - rowIndex → 최신글이 1번
        return filteredData.length - params.node.rowIndex;
      },
    },
    {
      field: "bdTitle",
      headerName: "제목",
      flex: 1,
      minWidth: 300,
      headerClass: "ag-center-header",
      cellStyle: {
        textAlign: "center",
        color: "#111827",
        fontWeight: "600",
        cursor: "pointer",
      },
    },
    {
      field: "bdWriter",
      headerName: "작성자",
      width: 120,
      headerClass: "ag-center-header",
      cellStyle: {
        textAlign: "center",
        color: "#374151",
        fontWeight: "600",
      },
    },
    {
      field: "bdRegdate",
      headerName: "등록일",
      width: 130,
      headerClass: "ag-center-header",
      cellStyle: {
        textAlign: "center",
        color: "#374151",
        fontWeight: "600",
      },
    },
    {
      field: "bdViewcnt",
      headerName: "조회수",
      width: 100,
      headerClass: "ag-center-header",
      cellStyle: {
        textAlign: "center",
        color: "#374151",
        fontWeight: "600",
      },
    },
  ];

  const handleSearch = () => {
    const filters = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (keyword) {
      filters.searchType = searchType;
      filters.keyword = keyword;
    }
    setAppliedFilters(filters);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setSearchType("title");
    setKeyword("");
    setAppliedFilters({});
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCreate = () => {
    navigate(`${basePath}/create`);
  };

  const handleRowClicked = (event) => {
    const bdId = event.data?.bdId;
    if (bdId) {
      navigate(`${basePath}/${bdId}`);
    }
  };

  // ========== 로딩 상태 ==========
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#0f4c81] mx-auto" />
          <p className="mt-4 text-gray-600">데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  // ========== 에러 상태 ==========
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md w-full">
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">데이터를 불러오지 못했습니다.</h2>
            <p className="text-gray-600 mb-4">{error.message}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ✅ 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {type === "notice" && "공지사항"}
            {type === "admin" && "행정예고"}
            {type === "inquiry" && "1:1 민원사항"}
          </h1>
        </div>
      </div>

      {/* ✅ 필터 */}
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-4">
            {/* 날짜 필터 */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">등록일자 :</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-40" />
              <span className="text-gray-600">~</span>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-40" />
            </div>

            {/* 검색 타입 */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">검색 :</label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="title">제목</option>
                <option value="writer">작성자</option>
              </select>
            </div>

            {/* 검색어 */}
            <div className="flex items-center gap-2 flex-1">
              <Input
                type="text"
                placeholder={searchType === "title" ? "제목으로 검색" : "작성자로 검색"}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-75"
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                검색
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                초기화
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* ✅ 데이터 그리드 */}
      <Card>
        <div className="flex justify-between pb-5">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              총 <span className="font-semibold text-gray-900">{filteredData.length}</span>건
            </span>
          </div>
          <div className="flex items-center justify-between">
            <Button size="sm" onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              등록
            </Button>
          </div>
        </div>

        <div className="ag-theme-alpine" style={{ width: "100%", height: "600px" }}>
          <AgGridReact
            rowData={filteredData}
            columnDefs={columnDefs}
            rowHeight={48}
            headerHeight={48}
            suppressCellFocus={true}
            suppressRowHoverHighlight={false}
            onRowClicked={handleRowClicked}
            domLayout="normal"
            getRowId={getRowId}
            rowClass="cursor-pointer"
          />
        </div>
      </Card>
    </div>
  );
}

export default NoticeListPage;
