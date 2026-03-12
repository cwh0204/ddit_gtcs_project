<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec"%>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<link rel="stylesheet" href="/css/shipper/information/complaint/complaint_list.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<div class="container" style="padding: 30px; min-width: 1200px;">

    <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
        <h2 style="color: #0f4c81; font-size: 20px; font-weight: bold; margin: 0;">민원사항</h2>
        <div style="font-size: 12px; color: #888;">Home > 정보센터 > 민원사항</div>
    </div>

    <div class="search-box">
        <span class="search-label">등록일자</span>
        <input type="date" id="startDate" class="form-input">
        <span>~</span>
        <input type="date" id="endDate" class="form-input">

        <span class="search-label" style="margin-left: 15px;">검색조건</span>
        <select id="searchType" class="form-select" style="width: 80px;">
            <option value="title">제목</option>
            <option value="writer">작성자</option>
        </select>
        <input type="text" id="searchKeyword" class="form-input" style="width: 200px;" placeholder="검색어를 입력하세요" onkeyup="if(window.event.keyCode==13){searchData()}">

        <button class="btn-lookup" onclick="searchData()">
            <i class="fas fa-search"></i> 검색
        </button>
    </div>

    <div style="margin-bottom: 10px; font-size: 13px; color: #333; display: flex; justify-content: space-between; align-items: center;">
        <span>총 <b style="color: #0f4c81;" id="totalCount">0</b>건의 민원사항이 있습니다.</span>
        <div style="display: flex; justify-content: flex-end; margin-top: 15px;">
            <button class="btn-write" onclick="location.href='/client/information/complaint/complaint_form'">
                <i class="fas fa-pen"></i> 등록
            </button>
        </div>
    </div>

    <div id="complaintGrid" class="ag-theme-quartz"></div>

    <div id="paginationArea" class="custom-pagination"></div>

</div>

<!-- 비밀번호 모달 -->
<div id="pwdModal" class="pwd-modal-overlay">
    <div class="pwd-modal-box">
        <h3 class="pwd-modal-title">🔒 비밀글</h3>
        <input type="password" id="pwdInput" class="pwd-modal-input" maxlength="4"
            oninput="this.value=this.value.replace(/[^0-9]/g,'').slice(0,4)"
            placeholder="● ● ● ●">
        <div class="pwd-modal-btns">
            <button onclick="confirmPwd()" class="pwd-btn-confirm">확인</button>
            <button onclick="closePwdModal()" class="pwd-btn-cancel">취소</button>
        </div>
    </div>
</div>

<script src="/js/shipper/information/complaint/complaint_list.js"></script>