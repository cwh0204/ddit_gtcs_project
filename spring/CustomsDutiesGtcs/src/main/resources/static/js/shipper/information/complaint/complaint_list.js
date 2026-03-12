/**
 * 민원사항 목록 - AG Grid (서버 데이터 연동)
 */
let gridApi;
const PAGE_SIZE = 10;

const swalConfig = {
    width: '400px',
    padding: '1.5rem',
    confirmButtonColor: '#0f4c81'
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await axios.get('/rest/board/list?bdType=민원사항', { headers });
        initGrid(response.data);

    } catch (error) {
        console.error('데이터 로드 실패:', error);
        initGrid([]);
    }

    // 엔터키로 비밀번호 확인
    document.querySelector('#pwdInput')?.addEventListener('keyup', e => {
        if (e.key === 'Enter') confirmPwd();
    });
});

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
                let html = '';

                // 비밀글 자물쇠 아이콘
                if (params.data.bdSecyn === 'Y') {
                    html += '<i class="fas fa-lock" style="color:#e74c3c; font-size:11px; margin-right:5px;"></i>';
                }

                html += `<span>${params.value}</span>`;

                // 3일 이내 New 표시
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
            const data = event.data;
            console.log('bdId:', data.bdId);  
            console.log('bdSecyn:', data.bdSecyn);

            if (data.bdSecyn === 'Y') {
                // bdCont에서 비밀번호 추출
                const match = data.bdCont && data.bdCont.match(/\|\|PWD:(\d{4})$/);
                const pwd = match ? match[1] : null;
                openPwdModal(pwd, data.bdId);
            } else {
                location.href = `/client/information/complaint/complaint_detail?bdId=${data.bdId}`;
            }
        }
    };

    agGrid.createGrid(document.querySelector('#complaintGrid'), gridOptions);
}

async function searchData() {
    try {
        const token = localStorage.getItem('accessToken');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const params = {
            bdType: '민원사항',
            startDate: document.querySelector('#startDate').value,
            endDate: document.querySelector('#endDate').value,
            searchType: document.querySelector('#searchType').value,
            keyword: document.querySelector('#searchKeyword').value
        };

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

function updateTotal() {
    if (!gridApi) return;
    const totalCountElement = document.querySelector('#totalCount');
    if (totalCountElement) {
        totalCountElement.textContent = gridApi.getDisplayedRowCount().toLocaleString();
    }
}

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

// =====================
// 비밀번호 모달
// =====================
let _targetPwd  = null;
let _targetBdId = null;

function openPwdModal(pwd, bdId) {
    _targetPwd  = pwd;
    _targetBdId = bdId;
    console.log('_targetBdId:', _targetBdId);
    document.querySelector('#pwdInput').value = '';
    document.querySelector('#pwdModal').style.display = 'flex';
    setTimeout(() => document.querySelector('#pwdInput').focus(), 100);
}

function closePwdModal() {
    document.querySelector('#pwdModal').style.display = 'none';
    _targetPwd  = null;
    _targetBdId = null;
}

function confirmPwd() {
    const input = document.querySelector('#pwdInput').value;
    if (input === _targetPwd) {
        const bdId = _targetBdId;  
        closePwdModal();
        location.href = `/client/information/complaint/complaint_detail?bdId=${bdId}`;  
    } else {
        Swal.fire({
            ...swalConfig,
            icon: 'error',
            title: '비밀번호 오류',
            text: '비밀번호가 틀렸습니다.'
        }).then(() => {
            document.querySelector('#pwdInput').value = '';
            document.querySelector('#pwdInput').focus();
        });
    }
}