<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec"%>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<link rel="stylesheet" href="/css/shipper/information/announcement/announcement_list.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<div class="container" style="padding: 30px; min-width: 1200px;">

    <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
        <h2 style="color: #0f4c81; font-size: 20px; font-weight: bold; margin: 0;">행정예고</h2>
        <div style="font-size: 12px; color: #888;">Home > 정보센터 > 행정예고</div>
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
        <span>총 <b style="color: #0f4c81;" id="totalCount">0</b>건의 행정예고가 있습니다.</span>
    </div>

    <div id="announcementGrid" class="ag-theme-quartz"></div>

    <div id="paginationArea" class="custom-pagination"></div>

</div>

<script src="/js/shipper/information/announcement/announcement_list.js"></script>