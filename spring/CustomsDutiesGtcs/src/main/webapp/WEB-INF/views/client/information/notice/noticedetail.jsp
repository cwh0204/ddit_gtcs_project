<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>

<link rel="stylesheet" href="/css/shipper/listdetail/listdetail/listdetailall.css">
<link rel="stylesheet" href="/css/shipper/information/notice/noticedetail.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

<div class="container">

    <div class="local-header">
        <h2>공지사항</h2>
        <div class="breadcrumb">Home > 고객지원 > 공지사항</div>
    </div>

    <!-- 정보 테이블 -->
    <div class="info-table">
        <div class="info-row">
            <div class="info-label">제목</div>
            <div class="info-value" id="bdTitle"></div>
        </div>
        <div class="info-row">
            <div class="info-label">등록자</div>
            <div class="info-value" id="bdWriter"></div>
            <div class="info-label">등록일</div>
            <div class="info-value" id="bdRegdate"></div>
        </div>
        <div class="info-row">
            <div class="info-label">조회수</div>
            <div class="info-value" id="bdViewcnt"></div>
            <div class="info-label">수정일</div>
            <div class="info-value" id="bdModdate"></div>
        </div>
        <div class="info-row">
            <div class="info-label">첨부파일</div>
            <div class="info-value" id="fileList">

            </div>
        </div>
        <div class="info-row">
            <div class="info-label">내용</div>
            <div class="info-value content" id="bdCont"></div>
        </div>
    </div>

    <!-- 버튼 그룹 -->
    <div class="detail-btn-group">
        <div id="btnGroup" style="display:none;">
            <button type="button" class="detail-btn delete">삭제</button>
            <button type="button" class="detail-btn edit">수정</button>
        </div>
        <a href="/client/information/notice/noticelist" class="detail-btn list">
            목록으로
        </a>
    </div>
</div>

<script src="/js/shipper/information/notice/noticedetail.js"></script>