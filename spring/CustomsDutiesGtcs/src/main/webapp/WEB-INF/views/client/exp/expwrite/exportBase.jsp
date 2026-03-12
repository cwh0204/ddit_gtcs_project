<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<!DOCTYPE html>
<html>
<link rel="stylesheet"
	href="/css/shipper/exp/expwrite/exportDeclaration.css">
<main class="content-area">
	<div class="container">
		<div class="local-header">
			<h2>수출신고서</h2>
			<div class="breadcrumb">Home > 수출통관 > 수출신고서</div>
		</div>

		<div class="tab-header" style="display: flex; align-items: center;">
			<button type="button" class="tab-btn active" onclick="openTab(event, 'section1')">공통사항1</button>
			<button type="button" class="tab-btn" onclick="openTab(event, 'section2')">공통사항2</button>
			<button type="button" class="tab-btn" onclick="openTab(event, 'section3')">물품정보</button>
			<button type="button" class="tab-btn" onclick="openTab(event, 'section4')">첨부파일</button>
            
            <button type="button" id="btnAutoFill" class="btn-autofill">
                 내 기본정보 불러오기
            </button>
		</div>

		<form id="exportForm">
			<jsp:include
				page="/WEB-INF/views/client/exp/expwrite/exportCommon.jsp" />

			<jsp:include
				page="/WEB-INF/views/client/exp/expwrite/exportCommon2.jsp" />

			<jsp:include
				page="/WEB-INF/views/client/exp/expwrite/exportItemDetails.jsp" />

			<jsp:include
				page="/WEB-INF/views/client/exp/expwrite/exportAttachment.jsp" />
		</form>

		<div class="footer-btn-group" 
		     style="position: relative; display: flex; justify-content: center; align-items: center; margin-top: 20px; gap: 10px;">
		
		    <button type="button" class="btn-submit-main" onclick="submitDeclaration('SUBMIT')">전송</button>
		    <button type="button" class="btn-reset-main" onclick="resetDeclaration()">삭제</button>
		
		    <button type="button" id="quick-export-autofill" onclick="autoFillExport()" 
		            style="position: absolute; right: 0; padding: 8px 16px; background-color: #f3f4f6; color: #4b5563; border: 1px solid #d1d5db; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold; transition: background-color 0.2s;" 
		            title="수출 데이터 자동입력"
		            onmouseover="this.style.backgroundColor='#e5e7eb'" 
		            onmouseout="this.style.backgroundColor='#f3f4f6'">
		            수출 데이터 자동입력
		    </button>
		
		</div>
	</div>

</main>
<script src="/js/shipper/exp/expwrite/exportDeclaration.js"></script>
<script src="/js/shipper/common/cago/preview.js"></script>
</html>