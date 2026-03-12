<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>

<link rel="stylesheet" href="/css/shipper/listdetail/listdetail/listdetailall.css">


<style>
    /* 테이블 내 다운로드 버튼 스타일 (이 페이지 전용) */
    .btn-download {
        background-color: #fff;
        border: 1px solid #0f4c81;
        color: #0f4c81;
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-weight: bold;
    }
    .btn-download:hover {
        background-color: #0f4c81;
        color: #fff;
    }
    
    /* 체크박스 크기 조절 */
    input[type="checkbox"] {
        cursor: pointer;
        width: 14px;
        height: 14px;
    }
</style>

<div class="container">
    <div class="local-header">
        <h2>수입신고 완료/필증 다운로드</h2>
        <div class="breadcrumb">홈 > 수입 진행 관리 > 완료/필증 다운로드</div>
    </div>

    <div class="search-box">
        <div class="search-item">
            <span class="search-label">신고일자</span>
            <input type="date" class="form-input"> ~ <input type="date" class="form-input">
        </div>
        
        <div class="search-item">
            <span class="search-label">검색조건</span>
            <select class="form-select" style="width: 100px;">
                <option value="decl_no">신고번호</option>
                <option value="bl_no">B/L No</option>
                <option value="shipper">화주상호</option>
            </select>
            <input type="text" class="form-input" placeholder="검색어 입력" style="width: 180px;">
        </div>
        
        <div class="search-item">
            <span class="search-label">진행상태</span>
            <select class="form-select">
                <option value="">전체</option>
                <option value="ACCEPTED" selected>수리(승인)</option>
                <option value="REJECTED">반려/취하</option>
            </select>
        </div>
        
        <button class="btn-lookup">조회하기</button>
    </div>

    <div style="margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
        <div>
            <span>검색결과: 총 <b style="color: #0f4c81;">12</b>건</span>
            <span style="font-size: 11px; color: #888; margin-left: 5px;">(수리 완료 건만 필증 출력이 가능합니다)</span>
        </div>
        <button class="btn-download" style="background: #666; color: white; border: none;">
            <i class="fas fa-file-pdf"></i> 선택 항목 일괄 다운로드
        </button>
    </div>

    <table class="data-table">
        <colgroup>
            <col width="5%">  <col width="5%">  <col width="15%"> <col width="12%"> <col width="15%"> <col width="10%"> <col width="10%"> <col width="10%"> </colgroup>
        <thead>
            <tr>
                <th><input type="checkbox" id="checkAll"></th>
                <th>No</th>
                <th>수입신고번호</th>
                <th>B/L 번호</th>
                <th>화주(업체명)</th>
                <th>신고일자</th>
                <th>상태</th>
                <th>증빙(필증)</th>
            </tr>
        </thead>
        <tbody id="listBody">
            <tr>
                <td onclick="event.stopPropagation()"><input type="checkbox" name="rowCheck" value="1"></td>
                <td>12</td>
                <td style="font-weight: bold; color: #0f4c81; cursor: pointer;" onclick="location.href='/shipper/import/detail?id=12'">110-12-3456789</td>
                <td>SEL-0987123</td>
                <td>(주)대한무역</td>
                <td>2024-01-28</td>
                <td><span class="badge accepted">수리</span></td>
                <td>
                    <button class="btn-download" onclick="alert('PDF 다운로드')">
                        PDF
                    </button>
                </td>
            </tr>
            
            <tr>
                <td onclick="event.stopPropagation()"><input type="checkbox" name="rowCheck" value="2"></td>
                <td>11</td>
                <td style="font-weight: bold; color: #0f4c81; cursor: pointer;" onclick="location.href='/shipper/import/detail?id=11'">110-12-3456780</td>
                <td>BUS-1122334</td>
                <td>(주)대한무역</td>
                <td>2024-01-27</td>
                <td><span class="badge accepted">수리</span></td>
                <td>
                    <button class="btn-download" onclick="alert('PDF 다운로드')">
                        PDF
                    </button>
                </td>
            </tr>

            <tr>
                <td onclick="event.stopPropagation()"><input type="checkbox" disabled></td>
                <td>10</td>
                <td style="font-weight: bold; color: #555; cursor: pointer;" onclick="location.href='/shipper/import/detail?id=10'">110-12-3456777</td>
                <td>INC-9988776</td>
                <td>(주)대한무역</td>
                <td>2024-01-26</td>
                <td><span class="badge review">심사중</span></td>
                <td>
                    <span style="font-size: 11px; color: #aaa;">발급전</span>
                </td>
            </tr>
        </tbody>
    </table>

    <div class="pagination">
        <button>&lt;</button>
        <button class="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>&gt;</button>
    </div>

    <div class="footer-mini" style="text-align: center; margin-top: 30px; font-size: 12px; color: #999;">
        &copy; 2026 Customs Logistics System. All rights reserved.
    </div>
</div>

<script>
    // 전체 선택 체크박스 기능
    document.getElementById('checkAll').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('input[name="rowCheck"]');
        checkboxes.forEach(cb => cb.checked = this.checked);
    });
</script>