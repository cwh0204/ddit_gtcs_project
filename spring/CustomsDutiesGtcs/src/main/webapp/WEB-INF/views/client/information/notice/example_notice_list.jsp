<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>공지사항 - AG Grid 컴포넌트 사용 예시</title>
    
    <!-- AG Grid 라이브러리 -->
    <script src="https://cdn.jsdelivr.net/npm/ag-grid-community/dist/ag-grid-community.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ag-grid-community/styles/ag-grid.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ag-grid-community/styles/ag-theme-quartz.css">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

<!-- AG Grid 컴포넌트 include -->
<jsp:include page="/WEB-INF/components/AgGridList.jsp">
    <jsp:param name="gridId" value="noticeGrid" />
    <jsp:param name="title" value="공지사항" />
    <jsp:param name="breadcrumb" value="Home > 정보센터 > 공지사항" />
    <jsp:param name="showSearch" value="true" />
    <jsp:param name="showActions" value="false" />
</jsp:include>

<script>
document.addEventListener('DOMContentLoaded', () => {
    
    // 샘플 데이터 (기존과 동일)
    const categories = ['IMPORT', 'EXPORT', 'LOGISTICS', 'GENERAL'];
    const depts = ['통관기획과', '수출심사과', '화물관리과', '운영지원팀'];
    
    const rowData = Array.from({length: 105}, (_, i) => {
        const idx = i % 4;
        const viewNo = 105 - i;
        const day = String((i % 28) + 1).padStart(2, '0');
        
        return {
            viewNo: viewNo,
            category: categories[idx],
            title: `[\${categories[idx]}] 공지사항 제목 테스트입니다. 내용 확인 요망 - \${viewNo}`, // \${} 수정
            file: i % 4 === 0,
            isNew: i < 3,
            dept: depts[idx],
            date: `2026-01-\${day}`, // \${} 수정
            views: 1000 - i
        };
    });

    const pinnedTopRowData = [
        {
            viewNo: '공지', // field명을 viewNo로 통일해야 함 (기존 no -> viewNo)
            isNotice: true,
            category: 'SYSTEM',
            title: '2026년 설 연휴 시스템 점검 안내 (02.16 ~ 02.18)',
            isNew: true,
            file: true,
            dept: '전산운영팀',
            date: '2026-01-28',
            views: 1240
        }
    ];

    // 컬럼 정의
    const columnDefs = [
        {
            headerName: "번호",
            field: "viewNo",
            width: 70,
            cellClass: "ag-center-cell", // 중앙 정렬
            cellRenderer: p => {
                // [중요] JSP 충돌 방지를 위해 \${} 사용
                return p.data.isNotice 
                    ? `<span class="notice-label">\${p.value}</span>` 
                    : p.value;
            }
        },
        {
            headerName: "분류",
            field: "category",
            width: 100,
            cellRenderer: p => {
                const map = {
                    'SYSTEM': 'system', 'IMPORT': 'import', 'EXPORT': 'export', 
                    'LOGISTICS': 'logistics', 'GENERAL': 'general'
                };
                const name = {
                    'SYSTEM': '시스템', 'IMPORT': '수입통관', 'EXPORT': '수출통관', 
                    'LOGISTICS': '화물/물류', 'GENERAL': '일반'
                };
                // [중요] \${} 로 수정하여 JS 변수로 인식하게 함
                return `<span class="badge \${map[p.value]}">\${name[p.value]}</span>`;
            }
        },
        {
            headerName: "제목",
            field: "title",
            flex: 1,
            cellClass: 'cell-left',
            cellRenderer: p => {
                let html = `<span>\${p.value}</span>`; // \${} 수정
                if (p.data.isNew) html += `<span class="badge-new">New</span>`;
                return html;
            }
        },
        {
            headerName: "첨부",
            field: "file",
            width: 70,
            cellRenderer: p => p.value ? '<i class="fas fa-paperclip" style="color:#666"></i>' : '-'
        },
        { headerName: "작성부서", field: "dept", width: 120 },
        { headerName: "작성일", field: "date", width: 120 },
        {
            headerName: "조회수",
            field: "views",
            width: 90,
            valueFormatter: p => p.value.toLocaleString()
        }
    ];

    // 검색 필드 정의
    const searchFields = [
        {
            type: 'dateRange',
            label: '등록일자',
            startId: 'startDate',
            endId: 'endDate',
            field: 'date'
        },
        {
            type: 'select',
            label: '분류',
            id: 'category',
            field: 'category', // 데이터에서 비교할 키값
            width: '100px',
            options: [
                { value: 'SYSTEM', label: '시스템' },
                { value: 'IMPORT', label: '수입통관' },
                { value: 'EXPORT', label: '수출통관' },
                { value: 'LOGISTICS', label: '화물/물류' },
                { value: 'GENERAL', label: '일반' }
            ]
        },
        {
            type: 'select',
            label: '검색조건',
            id: 'searchType', // 이 ID가 아래 text 필드의 conditionId와 일치해야 함
            width: '100px',
            options: [
                { value: 'title', label: '제목' },
                { value: 'dept', label: '부서' }
            ]
        },
        {
            type: 'text',
            label: '',
            id: 'keyword',
            width: '250px',
            placeholder: '검색어를 입력하세요',
            conditionId: 'searchType' // [핵심] 검색 조건(Select)의 ID를 지정해줌
        }
    ];

    // 그리드 초기화
    initAgGrid('noticeGrid', {
        columnDefs: columnDefs,
        rowData: rowData,
        pinnedTopRowData: pinnedTopRowData,
        pageSize: 10,
        searchFields: searchFields,
        onRowClicked: (e) => {
            console.log('공지사항 상세보기:', e.data);
        }
    });
});
</script>

</body>
</html>
