<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" session="false"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>



<style>
    /* AG Grid 공통 스타일 */
    .ag-grid-container {
        width: 100%;
        padding: 30px;
        min-width: 1200px;
        background: #fff;
    }

    /* 페이지 헤더 */
    .page-header {
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }

    .page-title {
        color: #0f4c81;
        font-size: 20px;
        font-weight: bold;
        margin: 0;
    }

    .breadcrumb-text {
        font-size: 12px;
        color: #888;
    }

    /* 검색박스 */
.search-box {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 12px 15px; /* 패딩 살짝 조정 */
    border-top: 2px solid #0f4c81; /* 테두리 강조 */
    border-bottom: 1px solid #ddd;
    gap: 8px; /* 요소 간 간격 축소 */
    flex-wrap: nowrap; /* 한 줄 유지 */
    overflow-x: auto;
}

.search-label {
    font-weight: bold;
    color: #333;
    font-size: 13px;
    margin-right: 5px;
    margin-left: 10px; /* 라벨 사이 간격 */
    white-space: nowrap;
}

    /* 입력창 스타일 */
    .form-input, .form-select {
        height: 30px !important;
        padding: 0 8px;
        border: 1px solid #ccc;
        border-radius: 0;
        font-size: 12px;
        box-sizing: border-box;
        color: #555;
        vertical-align: middle;
    }
    .search-label:first-child {
    margin-left: 0;
}

    input[type="date"].form-input {
        width: 120px;
        font-family: inherit;
    }

    /* 검색 버튼 */
    .btn-lookup {
    margin-left: auto;
        margin-left: auto;
        height: 30px;
        padding: 0 20px;
        background: #0f4c81;
        color: #fff;
        border: none;
        border-radius: 0;
        font-weight: bold;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;
    }

    .btn-lookup:hover {
        background-color: #09345a;
    }

    /* 총 건수 표시 */
    .total-count-area {
        margin-bottom: 10px;
        font-size: 13px;
        color: #333;
    }

    .total-count-area b {
        color: #0f4c81;
    }

    /* AG Grid 래퍼 */
    .ag-grid-wrapper {
        width: 100%;
        height: 500px;
    }

    /* AG Grid 스타일 커스터마이징 */
    .ag-root-wrapper {
        border: none !important;
    }

    .ag-header {
        background-color: #fff !important;
        border-top: 2px solid #0f4c81 !important;
        border-bottom: 1px solid #333 !important;
        font-weight: bold;
        color: #333;
        font-size: 13px;
    }

    .ag-header-cell-label {
        justify-content: center;
    }

    .ag-row {
        border-bottom: 1px solid #e0e0e0 !important;
        background-color: #fff;
    }

    .ag-cell {
        border-right: none !important;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        color: #333;
        padding: 0 5px;
        border: none !important;
    }

    .ag-cell-focus, .ag-cell:focus-visible {
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
    }

    .ag-row-selected {
        background-color: transparent !important;
    }

    .ag-row-selected::before {
        display: none !important;
    }

    .ag-row-hover {
        background-color: #f8fbff !important;
    }

    /* 왼쪽 정렬 셀 */
    .cell-left {
        justify-content: flex-start !important;
        padding-left: 15px !important;
        cursor: pointer;
    }

    .cell-left:hover {
        text-decoration: underline;
        color: #0f4c81;
    }

    /* 오른쪽 정렬 셀 */
    .cell-right {
        justify-content: flex-end !important;
        padding-right: 15px !important;
    }

    /* Pinned Row */
    .ag-pinned-top-header {
        border-bottom: none !important;
    }

    .ag-row-pinned {
        background-color: #fff !important;
        border-bottom: 1px solid #e0e0e0 !important;
        font-weight: normal;
        overflow: hidden !important;
    }

    .ag-body-horizontal-scroll {
        display: none !important;
    }

    /* 페이지네이션 */
    .custom-pagination {
        display: flex;
        justify-content: center;
        margin-top: 5px;
        gap: 0;
    }

    .pg-btn {
        width: 30px;
        height: 30px;
        border: 1px solid #ccc;
        background: #fff;
        color: #666;
        cursor: pointer;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: -1px;
    }

    .pg-btn:first-child {
        margin-left: 0;
    }

    .pg-btn:hover {
        background: #f1f1f1;
        position: relative;
        z-index: 2;
    }

    .pg-btn.active {
        background: #0f4c81;
        color: #fff;
        border-color: #0f4c81;
        font-weight: bold;
        position: relative;
        z-index: 3;
    }

    .pg-btn:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    /* 뱃지 */
    .badge {
        padding: 3px 10px;
        border-radius: 12px;
        color: #fff;
        font-size: 11px;
        display: inline-block;
        min-width: 60px;
        text-align: center;
    }

    .badge.system {
        background: #6610f2;
    }

    .badge.import {
        background: #0d6efd;
    }

    .badge.export {
        background: #198754;
    }

    .badge.logistics {
        background: #fd7e14;
    }

    .badge.general {
        background: #999;
    }

    .badge.pending {
        background: #ffc107;
        color: #333;
    }

    .badge.approved {
        background: #28a745;
    }

    .badge.rejected {
        background: #dc3545;
    }

    .badge.completed {
        background: #17a2b8;
    }

    .notice-label {
        color: #d63384;
        font-weight: bold;
    }

    .badge-new {
        color: #e74c3c;
        font-size: 9px;
        margin-left: 5px;
        border: 1px solid #e74c3c;
        padding: 0 3px;
        border-radius: 2px;
        background: #fff;
        font-weight: bold;
        line-height: 1.4;
        vertical-align: text-top;
    }

    /* 액션 버튼 그룹 */
    .action-buttons {
        display: flex;
        gap: 5px;
        justify-content: flex-end;
        margin-bottom: 10px;
    }

    .btn-action {
        height: 30px;
        padding: 0 15px;
        background: #fff;
        color: #333;
        border: 1px solid #ccc;
        cursor: pointer;
        font-size: 12px;
        display: inline-flex;
        align-items: center;
        gap: 5px;
    }

    .btn-action:hover {
        background: #f8f9fa;
        border-color: #999;
    }

    .btn-action.primary {
        background: #0f4c81;
        color: #fff;
        border-color: #0f4c81;
    }

    .btn-action.primary:hover {
        background: #09345a;
    }
    /* AG Grid 페이징 패널이 항상 보이도록 설정 */
	.ag-theme-alpine .ag-paging-panel {
	    border-top: 1px solid #bdc3c7;
	    height: 50px; /* 페이징 바 높이 고정 */
	    align-items: center;
	}
	
	/* 그리드 전체 높이 계산 시 페이징 영역 포함 */
	.ag-root-wrapper {
	    display: flex;
	    flex-direction: column;
	    height: 100%;
	}
</style>

<div class="ag-grid-container">
    <c:if test="${param.showSearch ne 'false'}">
        <div class="search-box" id="${param.gridId}_searchBox"></div>
    </c:if>

    <c:if test="${param.showActions ne 'false'}">
        <div class="action-buttons" id="${param.gridId}_actions"></div>
    </c:if>

    <%-- <div class="total-count-area">총 <b id="${param.gridId}_totalCount">0</b>건의 데이터가 있습니다.</div> --%>
    <div id="${param.gridId}" class="ag-grid-wrapper ag-theme-quartz"></div>
    <div id="${param.gridId}_pagination" class="custom-pagination"></div>
</div>

<script>
let g_originalData = {}; // 여러 그리드가 있을 수 있으므로 객체로 관리

function initAgGrid(gridId, config) {
    const PAGE_SIZE = config.pageSize || 10;
    let gridApi;
    let originalRowData = config.rowData || [];
    let originalPinnedData = config.pinnedTopRowData || [];
    
    // [추가] 서버 사이드 페이지네이션 모드 확인
    const isServerSide = config.serverSide === true;

    if (config.searchFields && config.searchFields.length > 0) renderSearchFields(gridId, config.searchFields);
    if (config.actionButtons && config.actionButtons.length > 0) renderActionButtons(gridId, config.actionButtons);

    const gridOptions = {
        theme: "quartz", 
        columnDefs: config.columnDefs,
        rowData: originalRowData,
        pinnedTopRowData: originalPinnedData,
        rowSelection: 'single',
        suppressCellFocus: true,
        // [수정] 서버 사이드일 때는 AG Grid 자체 페이지네이션 비활성화
        pagination: !isServerSide,
        paginationPageSize: PAGE_SIZE,
        suppressPaginationPanel: true,
        headerHeight: 40,
        rowHeight: 40,
        onGridReady: (params) => {
            gridApi = params.api;
            const gridDiv = document.getElementById(gridId);
            if (gridDiv) gridDiv.gridApi = gridApi;
            window[gridId + '_api'] = gridApi;
            
            if (!isServerSide) {
                updateTotalCount(gridId);
                renderPagination(gridId, gridApi);
            }
            // 서버 사이드는 외부에서 renderCustomPagination 호출
        },
        onPaginationChanged: (params) => {
            if (!isServerSide && params.api) {
                renderPagination(gridId, params.api);
            }
        },
        onRowClicked: config.onRowClicked || ((e) => { console.log("Row clicked:", e.data); })
    };

    const gridDiv = document.getElementById(gridId);
    agGrid.createGrid(gridDiv, gridOptions);

    // [검색 함수 등록]
    window[gridId + '_search'] = function() {
        searchData(gridId, window[gridId + '_api'], config.searchFields, originalRowData);
    };

    function updateTotalCount(gridId, filteredCount) {
        const normalCount = (filteredCount !== undefined) ? filteredCount : originalRowData.length;
        const totalElement = document.getElementById(gridId + '_totalCount');
        if (totalElement) totalElement.innerText = (normalCount + originalPinnedData.length).toLocaleString();
    }

    return { api: gridApi, originalData: originalRowData, updateTotalCount: updateTotalCount };
}

function renderSearchFields(gridId, searchFields) {
    const searchBox = document.getElementById(gridId + '_searchBox');
    if (!searchBox) return;

    let html = '';
    searchFields.forEach(field => {
        const fLabel = field.label;
        const fId = field.id;
        const fStartId = field.startId;
        const fEndId = field.endId;
        const fWidth = field.width || '100px';
        const fPlaceholder = field.placeholder || '전체';

        if (field.type === 'dateRange') {
            html += `
                <span class="search-label">\${fLabel}</span>
                <input type="date" id="\${fStartId}" class="form-input">
                <span>~</span>
                <input type="date" id="\${fEndId}" class="form-input">
            `;
        } else if (field.type === 'select') {
            const optionsHtml = field.options.map(opt => `<option value="\${opt.value}">\${opt.label}</option>`).join('');
            html += `
                <span class="search-label" style="margin-left: 15px;">\${fLabel}</span>
                <select id="\${fId}" class="form-select" style="width: \${fWidth};">
                    <option value="">\${fPlaceholder}</option>
                    \${optionsHtml}
                </select>
            `;
        } else if (field.type === 'text') {
            const fTextWidth = field.width || '200px';
            const fTextPlaceholder = field.placeholder || '검색어 입력';
            html += `
                <span class="search-label" style="margin-left: 15px;">\${fLabel}</span>
                <input type="text" id="\${fId}" class="form-input" 
                    style="width: \${fTextWidth};" 
                    placeholder="\${fTextPlaceholder}"
                    onkeyup="if(window.event.keyCode==13){window['\${gridId}_customSearch'] ? window['\${gridId}_customSearch'](1) : window['\${gridId}_search']()}">
            `;
        }
    });

    html += `<button class="btn-lookup" onclick="window['\${gridId}_customSearch'] ? window['\${gridId}_customSearch'](1) : window['\${gridId}_search']()"><i class="fas fa-search"></i> 검색</button>`;
    searchBox.innerHTML = html;
}

function renderActionButtons(gridId, actionButtons) {
    const actionsDiv = document.getElementById(gridId + '_actions');
    if (!actionsDiv) return;
    let html = '';
    actionButtons.forEach(btn => {
        const btnClass = btn.primary ? 'primary' : '';
        const iconHtml = btn.icon ? `<i class="\${btn.icon}"></i>` : '';
        html += `<button class="btn-action \${btnClass}" onclick="\${btn.onClick}">
                    \${iconHtml} \${btn.label}
                 </button>`;
    });
    actionsDiv.innerHTML = html;
}

function renderPagination(gridId, gridApi) {
    if (!gridApi) return;

    const totalPages = gridApi.paginationGetTotalPages();
    const currentPage = gridApi.paginationGetCurrentPage();
    const paginationArea = document.getElementById(gridId + '_pagination');

    if (!paginationArea) return;
    
    if (totalPages <= 0) {
        paginationArea.innerHTML = '';
        return;
    }

    let html = '';
    const isFirst = currentPage === 0;
    const isLast = currentPage === totalPages - 1;
    
    const apiPath = `window['\${gridId}_api']`;

    html += `<button class="pg-btn" onclick="\${apiPath}.paginationGoToFirstPage()" \${isFirst ? 'disabled' : ''}><i class="fas fa-angle-double-left"></i></button>`;
    html += `<button class="pg-btn" onclick="\${apiPath}.paginationGoToPreviousPage()" \${isFirst ? 'disabled' : ''}><i class="fas fa-angle-left"></i></button>`;
    
    let start = Math.max(0, currentPage - 2);
    let end = Math.min(totalPages, start + 5);
    if (end - start < 5) start = Math.max(0, end - 5);
    if (start < 0) start = 0;

    for (let i = start; i < end; i++) {
        const activeClass = (i === currentPage) ? 'active' : '';
        html += `<button class="pg-btn \${activeClass}" onclick="\${apiPath}.paginationGoToPage(\${i})">\${i + 1}</button>`;
    }

    html += `<button class="pg-btn" onclick="\${apiPath}.paginationGoToNextPage()" \${isLast ? 'disabled' : ''}><i class="fas fa-angle-right"></i></button>`;
    html += `<button class="pg-btn" onclick="\${apiPath}.paginationGoToLastPage()" \${isLast ? 'disabled' : ''}><i class="fas fa-angle-last-right"></i></button>`;
    
    paginationArea.innerHTML = html;
}

function searchData(gridId, gridApi, searchFields, originalRowData) {
    const customSearchFn = window[gridId + '_customSearch'];
    if (customSearchFn && typeof customSearchFn === 'function') {
        console.log("✅ 커스텀 검색 함수 실행:", gridId);
        customSearchFn(1); // 검색 시 1페이지로
        return;
    }
    
    if (!gridApi || !searchFields) return;

    const filters = {};
    searchFields.forEach(field => {
        if (field.type === 'dateRange') {
            const startEl = document.getElementById(field.startId);
            const endEl = document.getElementById(field.endId);
            filters[field.startId] = startEl ? startEl.value : '';
            filters[field.endId] = endEl ? endEl.value : '';
        } else {
            const el = document.getElementById(field.id);
            filters[field.id] = el ? el.value : '';
        }
    });

    const filteredData = originalRowData.filter(row => {
        let match = true;

        searchFields.forEach(field => {
            if (!match) return;

            if (field.type === 'dateRange') {
                const rowDate = row[field.field];
                if (rowDate) {
                    if (filters[field.startId] && rowDate < filters[field.startId]) match = false;
                    if (filters[field.endId] && rowDate > filters[field.endId]) match = false;
                }
            } 
            else if (field.type === 'select') {
                const isConditionSwitcher = searchFields.some(f => f.conditionId === field.id);
                if (isConditionSwitcher) return;

                const val = filters[field.id];
                if (val && field.field) {
                    const rowValue = row[field.field] ? String(row[field.field]) : '';
                    if (rowValue.toLowerCase() !== val.toLowerCase()) match = false;
                }
            }
            else if (field.type === 'text') {
                const searchText = filters[field.id] ? filters[field.id].toLowerCase().trim() : '';
                
                if (searchText) {
                    let conditionField = field.field;
                    
                    if (field.conditionId) {
                        const conditionVal = filters[field.conditionId];
                        if (conditionVal) conditionField = conditionVal;
                    }

                    if (conditionField === 'all') {
                        const allValues = [
                            row['title'], 
                            row['dept'], 
                            row['viewNo']
                        ].join(' ').toLowerCase();
                        
                        if (!allValues.includes(searchText)) match = false;
                    } 
                    else {
                        const targetValue = row[conditionField] ? String(row[conditionField]).toLowerCase() : '';
                        if (!targetValue.includes(searchText)) match = false;
                    }
                }
            }
        });

        return match;
    });

    gridApi.setGridOption('rowData', filteredData);
    gridApi.paginationGoToFirstPage();
    
    if (window[gridId + '_updateTotalCount']) {
        window[gridId + '_updateTotalCount'](gridId, filteredData.length);
    }
}
</script>
