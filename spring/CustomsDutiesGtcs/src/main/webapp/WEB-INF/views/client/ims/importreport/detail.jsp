<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>

<link rel="stylesheet" href="/css/shipper/listdetail/listdetail/listdetailall.css">

<style>
/* 평소에는 조회/수정용 버튼 무조건 숨김 */
.edit-only-btn { 
    display: none !important; 
}
    /* [이 페이지 전용 스타일] */
    
    /* 섹션 제목 */
    .group-title {
        background-color: #f1f4f8;
        padding: 12px 15px;
        font-weight: bold;
        color: #0f4c81;
        border-left: 4px solid #0f4c81;
        margin-top: 5px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 0 4px 4px 0;
    }
    .group-title:hover { background-color: #e2e6ea; }

    /* 상세 테이블 */
    .detail-table {
        width: 100%;
        border-collapse: collapse;
        border-top: 2px solid #555;
        font-size: 13px;
        table-layout: fixed;   /* 삐져나옴 원천 차단 1 */
        word-break: break-all; /* 삐져나옴 원천 차단 2 (긴 글자 줄바꿈) */
    }
    .detail-table th {
        background: #f9fbff;
        width: 15%;
        padding: 10px;
        border-bottom: 1px solid #ddd;
        border-right: 1px solid #eee;
        text-align: left;
        color: #444;
        font-weight: bold;
    }
    .detail-table td {
        width: 35%;
        padding: 10px;
        border-bottom: 1px solid #ddd;
        color: #333;
    }

    /* 란사항 그리드 테이블 */
    .grid-table {
        width: 100%;
        border-collapse: collapse;
        border-top: 2px solid #888;
        font-size: 13px;
    }
    .grid-table th {
        background: #f8f9fa;
        padding: 8px;
        border-bottom: 1px solid #ccc;
        text-align: center;
        font-weight: bold;
        color: #555;
    }
    .grid-table td {
        padding: 8px;
        border-bottom: 1px solid #eee;
        text-align: center;
        color: #444;
    }
    .grid-table td.text-right { text-align: right; }
    .grid-table td.text-left { text-align: left; }

    /* 컨테이너 뱃지 */
    .cntr-badge {
        display: inline-block;
        background: #eef2f6;
        border: 1px solid #ccc;
        padding: 4px 8px;
        margin: 2px;
        border-radius: 4px;
        font-size: 12px;
        color: #555;
        font-family: monospace;
    }
    /* =========================================
   1. 폼 테이블 찌그러짐(삐져나옴) 완벽 방지
========================================= */
.form-table {
    table-layout: fixed !important;
    width: 100% !important;
}

.form-table th {
    width: 15% !important; /* 라벨 칸 너비 고정 (총중량, 운임료 등) */
    white-space: nowrap !important;
}

.form-table td {
    width: 35% !important; /* 입력 칸 너비 고정 */
}

/* =========================================
   2. 보완/정정 버튼 강제 제어 (중요)
========================================= */
/* 평소에는 무조건 숨김 (!important로 외부 CSS 무력화) */
.edit-only-btn { 
    display: none !important; 
}

/* body에 is-editing 클래스가 붙었을 때만 보여줌 */
.is-editing .edit-only-btn { 
    display: inline-flex !important; 
}
/* 1. 표 깨짐 방지: 부모 칸(td)을 뚫고 나가지 못하게 감금 */
.form-table td {
    width: 35% !important;
    overflow: hidden !important; /* 넘치는 요소 숨김 */
}

/* 2. 문제의 flex-grow input 제어: 무한 확장을 막고 칸 안에 가두기 */
input.flex-grow {
    width: 100% !important; /* 무조건 칸 너비에 맞춤 */
    flex: none !important;  /* flex-grow 속성 무력화 */
}

/* 3. 버튼 숨기기: 어떤 클래스가 와도 무조건 숨김 */
.edit-only-btn {
    display: none !important;
}

/* 4. 보완/정정 모드일 때만 버튼 부활 (body에 클래스 부여 방식) */
body.is-editing .edit-only-btn {
    display: inline-flex !important;
}
</style>

<div class="container">
    
    <div class="local-header">
        <h2>수입신고서 조회 (신고번호: ${decNo})</h2>
        <div class="breadcrumb">Home > 수입 진행 관리 > 수입신고서</div>
    </div>

    <div class="view-section">
        <h3 class="group-title" onclick="toggleSection(this)">
            1. 공통사항 (기본정보) <i class="fas fa-chevron-up"></i>
        </h3>
        <div class="section-content">
            <table class="detail-table">
                <tbody>
                    <tr>
                        <th>상호 / 성명</th>
                        <td>${common.repTradeName} / ${common.repName}</td>
                        <th>전화번호</th>
                        <td>${common.repTel} (내선: ${common.repTelExt})</td>
                    </tr>
                    <tr>
                        <th>이메일</th>
                        <td colspan="3">${common.repEmail}</td>
                    </tr>
                    <tr>
                        <th>수입자</th>
                        <td>${common.importerName} (${common.importerCode})</td>
                        <th>수입자 구분</th>
                        <td>${common.importerType}</td>
                    </tr>
                    <tr>
                        <th>납세의무자</th>
                        <td>${common.taxpayerName} (${common.taxpayerId})</td>
                        <th>주소</th>
                        <td>${common.address}</td>
                    </tr>
                    <tr>
                        <th>해외거래처</th>
                        <td>${common.overseasBiz} (${common.overseasNation})</td>
                        <th>적출국 / 적재항</th>
                        <td>${common.exportNation} / ${common.loadingPort}</td>
                    </tr>
                    <tr>
                        <th>신고/거래구분</th>
                        <td>${common.decKind} / ${common.transType}</td>
                        <th>통관계획</th>
                        <td>${common.clearancePlan}</td>
                    </tr>
                    <tr>
                        <th>B/L No</th>
                        <td>${common.blNo}</td>
                        <th>화물관리번호</th>
                        <td>${common.cargoManageNo}</td>
                    </tr>
                    <tr>
                        <th>입항일 / 반입일</th>
                        <td>${common.arrivalDate} / ${common.carryInDate}</td>
                        <th>장치장소</th>
                        <td>${common.inspectionPlace}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="view-section">
        <h3 class="group-title" onclick="toggleSection(this)">
            2. 가격신고서 <i class="fas fa-chevron-up"></i>
        </h3>
        <div class="section-content">
            <table class="detail-table">
                <tbody>
                    <tr>
                        <th>전송구분</th>
                        <td>${price.transKind}</td>
                        <th>서식구분</th>
                        <td>${price.docType}</td>
                    </tr>
                    <tr>
                        <th>책임자</th>
                        <td>${price.mgrName} (${price.mgrTel})</td>
                        <th>실무자</th>
                        <td>${price.staffName} (${price.staffTel})</td>
                    </tr>
                    <tr>
                        <th>송품장번호</th>
                        <td>${price.invNo} (${price.invDate})</td>
                        <th>계약번호</th>
                        <td>${price.contNo}</td>
                    </tr>
                    <tr>
                        <th>구매자</th>
                        <td colspan="3">${price.buyer}</td>
                    </tr>
                    <tr>
                        <th>판매자</th>
                        <td colspan="3">${price.seller}</td>
                    </tr>
                    <tr>
                        <th>잠정가격신고</th>
                        <td>${price.provPriceNo}</td>
                        <th>가산금액</th>
                        <td>${price.provAddAmt} 원</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="view-section">
        <h3 class="group-title" onclick="toggleSection(this)">
            3. 결제 및 세액 <i class="fas fa-chevron-up"></i>
        </h3>
        <div class="section-content">
            <table class="detail-table">
                <tbody>
                    <tr>
                        <th>결제금액</th>
                        <td>${payment.payAmt} ${payment.payCurr} (${payment.incoterms})</td>
                        <th>환율</th>
                        <td>${payment.exchangeRate}</td>
                    </tr>
                    <tr>
                        <th>운임 / 보험료</th>
                        <td>${payment.freightAmt} / ${payment.insurAmt}</td>
                        <th>가산금액</th>
                        <td>${payment.addAmt}</td>
                    </tr>
                    <tr>
                        <th>총 중량</th>
                        <td>${payment.totalWeight} KG</td>
                        <th>총 포장개수</th>
                        <td>${payment.totalPkgCnt}</td>
                    </tr>
                    <tr style="background-color: #fff8f8;">
                        <th style="color: #c0392b;">총 과세가격</th>
                        <td style="font-weight:bold;">${payment.totalTaxable}</td>
                        <th style="color: #c0392b;">총 납부세액</th>
                        <td style="color: #e74c3c; font-weight: bold; font-size:14px;">${payment.totalTaxSum}</td>
                    </tr>
                </tbody>
            </table>
            
            <div style="margin-top: 15px; padding: 10px; background: #f9f9f9; border-radius: 4px;">
                <strong style="font-size: 12px; color: #666; display: block; margin-bottom: 5px;">- 컨테이너 목록</strong>
                <div>
                    <c:forEach var="cntr" items="${containerList}">
                        <span class="cntr-badge">${cntr.no}</span>
                    </c:forEach>
                    <c:if test="${empty containerList}">
                        <span style="font-size: 12px; color: #999;">등록된 컨테이너 정보가 없습니다.</span>
                    </c:if>
                </div>
            </div>
        </div>
    </div>

    <div class="view-section">
        <h3 class="group-title" onclick="toggleSection(this)">
            4. 란 사항 (물품정보) <i class="fas fa-chevron-up"></i>
        </h3>
        <div class="section-content">
            <table class="grid-table">
                <thead>
                    <tr>
                        <th style="width: 50px;">란No</th>
                        <th style="width: 100px;">HS부호</th>
                        <th>거래품명</th>
                        <th style="width: 100px;">순중량</th>
                        <th style="width: 120px;">과세가격</th>
                        <th style="width: 120px;">세율(관세/부가)</th>
                    </tr>
                </thead>
                <tbody>
                    <c:forEach var="lan" items="${lanList}">
                        <tr>
                            <td>${lan.no}</td>
                            <td>${lan.hsCode}</td>
                            <td class="text-left">${lan.itemName}</td>
                            <td class="text-right">${lan.netWeight} KG</td>
                            <td class="text-right">${lan.taxableValue}</td>
                            <td>${lan.dutyRate}% / 10%</td>
                        </tr>
                    </c:forEach>
                    <c:if test="${empty lanList}">
                        <tr>
                            <td>1</td>
                            <td>8542.31-0000</td>
                            <td class="text-left">PROCESSOR (CPU)</td>
                            <td class="text-right">500 KG</td>
                            <td class="text-right">50,000 USD</td>
                            <td>0% / 10%</td>
                        </tr>
                    </c:if>
                </tbody>
            </table>
        </div>
    </div>

    <div class="view-section">
        <h3 class="group-title" onclick="toggleSection(this)">
            5. 첨부파일 <i class="fas fa-chevron-up"></i>
        </h3>
        <div class="section-content" style="padding: 10px; border: 1px solid #ddd; border-top: none;">
            <ul style="list-style: none; padding: 0; margin: 0;">
                <c:forEach var="file" items="${fileList}">
                    <li style="padding: 8px 0; border-bottom: 1px dashed #eee; display: flex; justify-content: space-between;">
                        <span><i class="fas fa-paperclip" style="color: #666;"></i> ${file.name}</span>
                        <button class="btn-download" onclick="alert('다운로드')">다운로드</button>
                    </li>
                </c:forEach>
                <c:if test="${empty fileList}">
                    <li style="padding: 10px; color: #999; text-align: center;">첨부된 파일이 없습니다.</li>
                </c:if>
            </ul>
        </div>
    </div>

    <div class="btn-group" style="display: flex; justify-content: center; gap: 10px; margin-top: 40px; margin-bottom: 20px;">
        <button type="button" class="btn-lookup" style="min-width: 100px; margin-left: 0;" onclick="window.print()">
            <i class="fas fa-print"></i> 인쇄
        </button>
        <button type="button" class="btn-gray" onclick="history.back()">
            목록
        </button>
    </div>

    <div class="footer-mini" style="text-align: center; margin-top: 30px; font-size: 12px; color: #999;">
        &copy; 2026 Customs Logistics System. All rights reserved.
    </div>
</div>

<script>
    // 섹션 접기/펼치기 기능
    function toggleSection(header) {
        const content = header.nextElementSibling;
        const icon = header.querySelector('i');
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        } else {
            content.style.display = 'none';
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    }
    document.addEventListener('DOMContentLoaded', function() {
        // 서버에서 넘어온 상태값 (실제 변수명에 맞게 확인해주세요)
        var currentStatus = '${common.status}'; 
        
        // 테스트 해보고 싶으시면 아래 주석(//)을 지우세요!
        // currentStatus = 'SUPPLEMENT'; 

        // 상태가 '보완' 이거나 '정정'일 때만 body에 클래스 추가
        if (currentStatus === 'SUPPLEMENT' || currentStatus === 'CORRECTION') {
            document.body.classList.add('is-editing');
            console.log("보완/정정 모드 활성화: 버튼들이 나타납니다.");
        } else {
            console.log("일반 모드: 버튼들이 숨겨집니다.");
        }
    });
</script>