<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>

<style>
/* 1. 탭 메뉴 스타일 */
.status-tabs {
	display: flex;
	gap: 0;
	margin: 20px 0 0 0;
	border-bottom: 3px solid #0f4c81;
	background: transparent;
	padding: 0;
	flex-shrink: 0;
}

.status-tabs .tab-btn {
	flex: 1;
	padding: 14px 20px;
	background: #f8f9fa;
	border: none;
	border-bottom: 3px solid transparent;
	cursor: pointer;
	font-weight: 600;
	font-size: 14px;
	color: #666;
	transition: all 0.3s ease;
	position: relative;
	margin-bottom: -3px;
	border-radius: 0;
}

.status-tabs .tab-btn:first-child {
	border-top-left-radius: 8px;
}

.status-tabs .tab-btn:last-child {
	border-top-right-radius: 8px;
}

.status-tabs .tab-btn:hover {
	background: rgba(15, 76, 129, 0.08);
	color: #0f4c81;
}

.status-tabs .tab-btn.active {
	background: #fff;
	color: #0f4c81;
	border-bottom-color: #0f4c81;
	font-weight: bold;
	box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

/* 2. 그리드 컨테이너 */
.ag-grid-container {
	width: 100%;
	height: auto !important;
	min-height: 600px;
	overflow-y: auto;
	-ms-overflow-style: none;
	scrollbar-width: none;
	padding: 30px;
	padding-bottom: 20px;
	background: #fff;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}

.ag-grid-container::-webkit-scrollbar {
	display: none;
}

.page-header {
	margin-bottom: 10px;
	padding-bottom: 15px;
	border-bottom: 2px solid #e0e0e0;
	flex-shrink: 0;
}

.page-title {
	font-size: 22px;
	font-weight: bold;
	color: #0f4c81;
	margin-bottom: 8px;
}

.breadcrumb-text {
	font-size: 12px;
	color: #888;
}

/* 3. 검색창 스타일 */
[id$="_searchBox"] {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 15px 20px;
	background: #f8f9fa;
	border: 1px solid #ddd;
	border-radius: 4px;
	flex-wrap: wrap;
	flex-shrink: 0;
}

[id$="_searchBox"] input, [id$="_searchBox"] select {
	height: 34px;
	padding: 0 10px;
	border: 1px solid #ccc;
	border-radius: 4px;
	font-size: 13px;
}

[id$="_searchBox"] button {
	height: 34px;
	padding: 0 15px;
	font-weight: bold;
}

/* 4. 그리드 본체 */
#exportDeclGrid {
	width: 100%;
	height: auto !important;
	min-height: 480px;
	flex: none;
}

.ag-theme-quartz .ag-row {
	cursor: pointer;
}

/* 5. 뱃지 스타일 */
.badge {
	padding: 3px 10px;
	border-radius: 12px;
	color: #fff;
	font-size: 11px;
	display: inline-block;
	min-width: 60px;
	text-align: center;
	font-weight: 500;
}

.badge.wait {
	background: #6c757d;
} /* 심사대기 */
.badge.ing {
	background: #0d6efd;
} /* 심사중 */
.badge.inspect {
	background: #17a2b8;
} /* 검사중 */
.badge.supp {
	background: #fd7e14;
} /* 보완/정정 */
.badge.pay {
	background: #6f42c1;
} /* 수리 (보라색) */
.badge.done {
	background: #28a745;
} /* 승인 */
.badge.err {
	background: #dc3545;
} /* 반려 */

/* 커스텀 컨트롤 바 스타일 (수입과 동일) */
.custom-control-bar {
    display: flex;
    justify-content: space-between; /* 양 끝 정렬 */
    align-items: center;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 5px;
}

.custom-total-text {
    font-size: 14px;
    font-weight: 500;
    color: #333;
}
.custom-total-text strong {
    color: #000;
    font-weight: bold;
}

.btn-new-decl {
    background-color: #0f4c81;
    color: white;
    border: none;
    padding: 6px 14px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 6px;
}

/* 커스텀 컨트롤 바 스타일 (수입과 동일) */
.custom-control-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 5px;
}

.custom-total-text { font-size: 14px; font-weight: 500; color: #333; }
.custom-total-text strong { color: #000; font-weight: bold; }

.control-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.btn-refresh {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 6px 14px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background 0.2s;
}
.btn-refresh:hover { background-color: #5a6268; }

.btn-new-decl {
    background-color: #0f4c81;
    color: white;
    border: none;
    padding: 6px 14px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 6px;
}
.btn-new-decl:hover { background-color: #0a3b66; }

</style>

<div class="ag-grid-container">
	<div class="page-header">
		<h2 class="page-title">수출신고 현황 조회</h2>
		<div class="breadcrumb-text">
			<i class="fas fa-home"></i> Home > 수출통관 > 수출신고 현황 조회
		</div>
	</div>
	
	<div id="newControlBarTemplate" style="display:none;">
        <div class="custom-control-bar">
            <span class="custom-total-text">
                총 <strong id="customTotalCount">0</strong>건의 데이터가 있습니다.
            </span>
            
            <div class="control-actions">
                <button type="button" class="btn-refresh" onclick="manualRefresh()">
                    <i class="fas fa-sync-alt"></i> 새로고침
                </button>

                <button type="button" class="btn-new-decl" onclick="goToNewExportDeclaration()">
                    <i class="fas fa-plus"></i> 수출 신고
                </button>
            </div>
        </div>
    </div>
	
	<jsp:include page="/WEB-INF/components/AgGridList.jsp">
		<jsp:param name="gridId" value="exportDeclGrid" />
		<jsp:param name="showSearch" value="true" />
		<jsp:param name="showActions" value="false" />
	</jsp:include>
</div>

<script>
// =========================================================
// [1] 전역 변수
// =========================================================
const GRID_ID = 'exportDeclGrid';
let myGridApi = null;
let currentPageNum = 1;

// =========================================================
// [2] 커스텀 컨트롤 바 주입
// =========================================================
const injectCustomControlBar = () => {
    const searchBox = document.getElementById(GRID_ID + '_searchBox'); 
    const template = document.getElementById('newControlBarTemplate');
    
    if (searchBox && template) {
        searchBox.insertAdjacentElement('afterend', template.firstElementChild);
        console.log("커스텀 컨트롤 바 배치 완료 (수출)");
    } else {
        setTimeout(injectCustomControlBar, 100);
    }
};

// =========================================================
// [3] 검색 파라미터 생성
// =========================================================
const getSearchParams = (page) => {
    const statusValue = document.getElementById('searchStatus') ? document.getElementById('searchStatus').value : '';
    return {
        memId: parseInt(window.USER_CONTEXT?.memId || 0),
        pageNum: page,
        amount: 10,
        status: (statusValue === 'ALL') ? '' : statusValue,
        type: document.getElementById('searchCondition') ? document.getElementById('searchCondition').value : '',
        keyword: document.getElementById('searchText') ? document.getElementById('searchText').value : '',
        startDate: document.getElementById('startDate') ? document.getElementById('startDate').value : '',
        endDate: document.getElementById('endDate') ? document.getElementById('endDate').value : '',
        t: new Date().getTime()
    };
};

// =========================================================
// [4] 데이터 로드 핵심 함수
// =========================================================
const loadPageData = (pageNum = 1, isBackground = false) => {
    if (!myGridApi) {
        const gridEl = document.getElementById(GRID_ID);
        myGridApi = (gridEl && gridEl.gridApi) ? gridEl.gridApi : window[GRID_ID + '_api'];
    }

    if (!myGridApi) {
        console.warn("그리드가 아직 준비되지 않아 대기합니다.");
        return;
    }

    currentPageNum = pageNum;
    if (!isBackground) myGridApi.showLoadingOverlay();

    axios.get('/rest/export', { params: getSearchParams(currentPageNum) })
        .then(res => {
            const data = res.data || [];
            console.log(isBackground ? "[SSE 자동갱신] 수출 데이터 도착" : "[일반로드] 수출 데이터 도착");

            if (typeof myGridApi.setGridOption === 'function') {
                myGridApi.setGridOption('rowData', data);
            } else {
                myGridApi.setRowData(data);
            }

            const totalCount = data.length > 0 ? (data[0].totalCount || 0) : 0;
            const totalEl = document.getElementById('customTotalCount');
            if(totalEl) totalEl.innerText = totalCount.toLocaleString();

            const totalPages = data.length > 0 ? (data[0].totalPage || 1) : 1;
            if(typeof renderCustomPagination === 'function') renderCustomPagination(currentPageNum, totalPages);
            
            myGridApi.hideOverlay();
            if (data.length === 0 && !isBackground) myGridApi.showNoRowsOverlay();
        })
        .catch(err => {
            console.error("데이터 로드 실패:", err);
            myGridApi?.hideOverlay();
        });
};

// =========================================================
// [5] SSE 알림 수신 함수
// =========================================================
function fetchSilentData() {
    console.log("[SSE] 신호 감지 -> 수출 백그라운드 갱신 시도");
    loadPageData(currentPageNum, true);
}

const manualRefresh = () => loadPageData(currentPageNum, false);

// =========================================================
// [6] 기타 유틸 (상태 변환, 뱃지, 페이징)
// =========================================================
const normalizeStatus = (status) => {
    if (!status) return '-';
    const s = status.toString().toUpperCase().trim();
    const map = {
        'BONDED_IN': '보세입고완료', 'WAITING': '심사대기', 'PHYSICAL': '현품검사중',
        'INSPECTION_COMPLETED': '현품검사완료', 'SUPPLEMENT': '보완/정정', 'REVIEWING': '심사중',
        'ACCEPTED': '수리', 'REJECTED': '반려', 'PAY_WAITING': '납부 대기',
        'PAY_COMPLETED': '납부 완료', 'WH_IN_APPROVED': '반입승인', 'WH_IN_REJECTED': '반입차단',
        'RELEASE_APPROVED': '반출승인', 'RELEASE_REJECTED': '반출차단', 'APPROVED': '통관승인',
        'DELIVERED': '출고 완료'
    };
    return map[s] || status;
};

const statusBadgeRenderer = (p) => {
    const originalStatus = p.value || '';
    const normalizedStatus = normalizeStatus(originalStatus);
    const s = originalStatus.toString().toUpperCase().trim();
    
    let cls = 'wait'; 
    if (['REVIEWING', 'PHYSICAL', 'SUPPLEMENT'].includes(s)) cls = 'ing';
    else if (['ACCEPTED', 'PAY_WAITING', 'WH_IN_APPROVED', 'RELEASE_APPROVED'].includes(s)) cls = 'pay';
    else if (['PAY_COMPLETED', 'APPROVED', 'DELIVERED', 'INSPECTION_COMPLETED'].includes(s)) cls = 'done';
    else if (['REJECTED', 'WH_IN_REJECTED', 'RELEASE_REJECTED'].includes(s)) cls = 'err';
    
    return '<span class="badge ' + cls + '">' + normalizedStatus + '</span>';
};

const renderCustomPagination = (curr, total) => {
    const area = document.getElementById(GRID_ID + '_pagination');
    if (!area || total <= 0) return;
    
    let h = '';
    const start = Math.max(1, curr - 2);
    const end = Math.min(total, start + 4);
    
    h += '<button class="pg-btn" onclick="loadPageData(1)" ' + (curr === 1 ? 'disabled' : '') + '><i class="fas fa-angle-double-left"></i></button>';
    h += '<button class="pg-btn" onclick="loadPageData(' + (curr - 1) + ')" ' + (curr === 1 ? 'disabled' : '') + '><i class="fas fa-angle-left"></i></button>';
    
    for(let i = start; i <= end; i++) {
        const activeClass = (i === curr) ? 'active' : '';
        h += '<button class="pg-btn ' + activeClass + '" onclick="loadPageData(' + i + ')">' + i + '</button>';
    }
    
    h += '<button class="pg-btn" onclick="loadPageData(' + (curr + 1) + ')" ' + (curr === total ? 'disabled' : '') + '><i class="fas fa-angle-right"></i></button>';
    h += '<button class="pg-btn" onclick="loadPageData(' + total + ')" ' + (curr === total ? 'disabled' : '') + '><i class="fas fa-angle-double-right"></i></button>';
    
    area.innerHTML = h;
};

function goToNewExportDeclaration() {
    location.href = '/client/exp/expwrite/exportBase';
}

// =========================================================
// [7] 화면 로드 초기화
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const columnDefs = [
        { headerName: "No", field: "rnum", width: 70, cellClass: "ag-center-cell" }, 
        { headerName: "수출신고번호", field: "exportNumber", width: 180, cellClass: "cell-left" }, 
        { headerName: "신고일자", field: "submitDate", width: 110 },
        { headerName: "진행상태", field: "status", width: 120, cellRenderer: statusBadgeRenderer },
        { headerName: "물품명", field: "itemNameDeclared", flex: 1, cellClass: "cell-left" },
        { headerName: "목적국", field: "destCountry", width: 90 }
    ];

    const searchFields = [
        { type: 'dateRange', label: '신고일자', startId: 'startDate', endId: 'endDate', field: 'submitDate' }, 
        { 
            type: 'select', label: '진행상태', id: 'searchStatus', width: '120px', 
            options: [
                { value: 'BONDED_IN', label: '보세입고완료' }, { value: 'WAITING', label: '심사대기' },
                { value: 'REVIEWING', label: '심사중' }, { value: 'PHYSICAL', label: '현품검사중' },
                { value: 'INSPECTION_COMPLETED', label: '현품검사완료' }, { value: 'SUPPLEMENT', label: '보완/정정' },
                { value: 'ACCEPTED', label: '수리' }, { value: 'REJECTED', label: '반려' },
                { value: 'PAY_WAITING', label: '납부 대기' }, { value: 'PAY_COMPLETED', label: '납부 완료' },
                { value: 'WH_IN_APPROVED', label: '반입승인' }, { value: 'WH_IN_REJECTED', label: '반입차단' },
                { value: 'RELEASE_APPROVED', label: '반출승인' }, { value: 'RELEASE_REJECTED', label: '반출차단' },
                { value: 'APPROVED', label: '통관승인' }, { value: 'DELIVERED', label: '출고 완료' }
            ]
        },
        { 
            type: 'select', label: '검색조건', id: 'searchCondition', width: '120px', 
            options: [
                { value: 'exportNumber', label: '신고번호' },
                { value: 'itemNameDeclared', label: '물품명' },
                { value: 'destCountry', label: '목적국' }
            ] 
        },
        { type: 'text', label: '', id: 'searchText', width: '250px', placeholder: '검색어를 입력하세요' }
    ];
    
    initAgGrid(GRID_ID, {
        columnDefs: columnDefs,
        rowData: [], 
        pageSize: 10,
        searchFields: searchFields,
        serverSide: true,
        onRowClicked: (e) => {
            if (e.data && e.data.exportId) {
                location.href = '/client/exp/status/detail?id=' + e.data.exportId;
            }
        }
    });

    window[GRID_ID + '_customSearch'] = (p) => loadPageData(p, false);
    injectCustomControlBar();
    
    setTimeout(() => {
        const gridElement = document.getElementById(GRID_ID);
        myGridApi = window[GRID_ID + '_api'] || (gridElement ? gridElement.gridApi : null);

        if (myGridApi) {
            console.log("수출 Grid API 연결 완료");
            
            const urlParams = new URLSearchParams(window.location.search);
            const status = urlParams.get('status');
            if (status) { 
                const st = document.getElementById('searchStatus'); 
                if(st) st.value = status; 
            }

            const searchDate = urlParams.get('searchDate');
            if (searchDate) {
                const sd = document.getElementById('startDate');
                const ed = document.getElementById('endDate');
                if(sd) sd.value = searchDate;
                if(ed) ed.value = searchDate;
            } else {
                const sDate = urlParams.get('startDate');
                const eDate = urlParams.get('endDate');
                if (sDate) { const sd = document.getElementById('startDate'); if(sd) sd.value = sDate; }
                if (eDate) { const ed = document.getElementById('endDate'); if(ed) ed.value = eDate; }
            }

            loadPageData(1);
            initGlobalSSE(["EXPORT_REFRESH", "WAREHOUSE_REFRESH", "IMPORT_REFRESH"], fetchSilentData);
        }
    }, 300);
});
</script>