/**
 * 행정예고 목록 - AG Grid (서버 데이터 연동)
 */
let gridApi;
const PAGE_SIZE = 10;

const swalConfig = {
    width: '400px',
    padding: '1.5rem',
    confirmButtonColor: '#0f4c81'
};

// 페이지 로드 시 서버에서 데이터 가져오기
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await axios.get('/rest/board/list?bdType=행정예고', { headers });
        initGrid(response.data);

    } catch (error) {
        console.error('데이터 로드 실패:', error);
        initGrid([]);
    }
});

// 그리드 초기화 함수
function initGrid(rowData) {
    const columnDefs = [
        {
            headerName: "번호",
            field: "rowNum",
            width: 60,
            valueGetter: params => {
                return params.api.getDisplayedRowCount() - params.node.rowIndex;
            }
        },
        {
            headerName: "제목",
            field: "bdTitle",
            flex: 1,
            cellClass: 'cell-left',
            cellRenderer: params => {
                let html = `<span>${params.value}</span>`;

                // 3일 이내 등록된 글에 New 표시
                const diffDays = Math.floor((new Date() - new Date(params.data.bdRegdate)) / (1000 * 60 * 60 * 24));
                if (diffDays <= 2) {
                    html += '<span class="badge-new">New</span>';
                }

                return html;
            }
        },
        {
            headerName: "등록자",
            field: "bdWriter",
            width: 100
        },
        {
            headerName: "등록일",
            field: "bdRegdate",
            width: 100
        },
        {
            headerName: "조회수",
            field: "bdViewcnt",
            width: 80,
            valueFormatter: params => params.value ? params.value.toLocaleString() : '0'
        }
    ];

    const gridOptions = {
        columnDefs,
        rowData,
        rowSelection: 'single',
        suppressCellFocus: true,
        suppressMovableColumns: true,
        suppressHorizontalScroll: true,
        pagination: true,
        paginationPageSize: PAGE_SIZE,
        suppressPaginationPanel: true,
        headerHeight: 40,
        rowHeight: 40,

        onGridReady: params => {
            gridApi = params.api;
            updateTotal();
            renderPagination();
        },
        onPaginationChanged: renderPagination,
        onRowClicked: event => {
            location.href = `/client/information/announcement/announcement_detail?bdId=${event.data.bdId}`;
        }
    };

    agGrid.createGrid(document.querySelector('#announcementGrid'), gridOptions);
}

// 검색 기능
async function searchData() {
    try {
        const token = localStorage.getItem('accessToken');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const params = {
            bdType: '행정예고',
            startDate: document.querySelector('#startDate').value,
            endDate: document.querySelector('#endDate').value,
            statusType: document.querySelector('#statusType').value,
            searchType: document.querySelector('#searchType').value,
            keyword: document.querySelector('#searchKeyword').value
        };

        // 빈 값 제거
        Object.keys(params).forEach(key => !params[key] && delete params[key]);

        const response = await axios.get('/rest/board/list', { headers, params });

        if (gridApi) {
            gridApi.setGridOption('rowData', response.data);
            updateTotal();
            renderPagination();
        }

    } catch (error) {
        console.error('검색 실패:', error);
        Swal.fire({
            ...swalConfig,
            icon: 'error',
            title: '검색 오류',
            text: '검색 중 오류가 발생했습니다.'
        });
    }
}

// 총 건수 업데이트
function updateTotal() {
    if (!gridApi) return;

    const totalCountElement = document.querySelector('#totalCount');
    if (totalCountElement) {
        totalCountElement.textContent = gridApi.getDisplayedRowCount().toLocaleString();
    }
}

// 페이지네이션 렌더링
function renderPagination() {
    if (!gridApi) return;

    const totalPages = gridApi.paginationGetTotalPages();
    const currentPage = gridApi.paginationGetCurrentPage();
    const paginationArea = document.querySelector('#paginationArea');

    if (!paginationArea || totalPages === 0) {
        if (paginationArea) paginationArea.innerHTML = '';
        return;
    }

    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage === totalPages - 1;

    const buttons = [];

    buttons.push(
        createPageButton('first', isFirstPage, '<i class="fas fa-angle-double-left"></i>'),
        createPageButton('previous', isFirstPage, '<i class="fas fa-angle-left"></i>')
    );

    const start = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
    const end = Math.min(totalPages, start + 5);

    for (let i = start; i < end; i++) {
        buttons.push(createPageButton(i, false, i + 1, i === currentPage));
    }

    buttons.push(
        createPageButton('next', isLastPage, '<i class="fas fa-angle-right"></i>'),
        createPageButton('last', isLastPage, '<i class="fas fa-angle-double-right"></i>')
    );

    paginationArea.innerHTML = buttons.join('');
}

// 페이지 버튼 생성 헬퍼 함수
function createPageButton(page, disabled, content, isActive = false) {
    const actions = {
        first: 'paginationGoToFirstPage',
        previous: 'paginationGoToPreviousPage',
        next: 'paginationGoToNextPage',
        last: 'paginationGoToLastPage'
    };

    const onClick = !disabled && (actions[page] ? `gridApi.${actions[page]}()` : `gridApi.paginationGoToPage(${page})`);

    return `<button class="pg-btn ${isActive ? 'active' : ''}" 
                    ${onClick ? `onclick="${onClick}"` : ''} 
                    ${disabled ? 'disabled' : ''}>
                ${content}
            </button>`;
}