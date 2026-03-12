<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<!-- 수입신고서 작성 페이지 -->
<!DOCTYPE html>
<html>
<link rel="stylesheet"
	href="/css/shipper/ims/imswrite/importDeclaration.css">
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<main class="content-area">
	<div class="container">
		<div class="local-header">
			<h2>수입신고서</h2>
			<div class="breadcrumb">Home > 수입통관 > 수입신고서</div>
		</div>
		<div class="tab-header" style="display: flex; align-items: center;">
			<button type="button" class="tab-btn active"
				onclick="openTab(event, 'section1')">1. 공통사항</button>
			<button type="button" class="tab-btn"
				onclick="openTab(event, 'section3')">2. 결제 및 세액</button>
			<button type="button" class="tab-btn"
				onclick="openTab(event, 'section4')">3. 물품 정보</button>
			<button type="button" class="tab-btn"
				onclick="openTab(event, 'section5')">4. 첨부파일</button>
                
            <button type="button" id="btnAutoFill" class="btn-autofill">
                 내 기본정보 불러오기
            </button>
		</div>

		<form id="importForm" onsubmit="return false;" enctype="multipart/form-data">

			<jsp:include
				page="/WEB-INF/views/client/ims/imswrite/importCommon.jsp" />

			<jsp:include
				page="/WEB-INF/views/client/ims/imswrite/importPayment.jsp" />

			<jsp:include
				page="/WEB-INF/views/client/ims/imswrite/importItemDetails.jsp" />

			<jsp:include
				page="/WEB-INF/views/client/ims/imswrite/importAttachment.jsp" />

		</form>

		<div class="footer-btn-group"
            style="text-align: center; margin-top: 20px;">
            
            <button type="button" class="btn primary"
                onclick="submitDeclaration()">전송</button>

            <button type="button" class="btn" onclick="resetForm()">초기화</button>
        </div>
	</div>
	<div id="quick-autofill-trigger" 
     onclick="autoFill()" 
     style="position: fixed; top: 0; left: 0; width: 30px; height: 30px; 
            background: rgba(0,0,0,0.01); z-index: 9999; cursor: pointer;" 
     title="더미데이터 입력">
	</div>
</main>
<script src="/js/shipper/ims/imswrite/importDeclaration.js"></script>
<script src="/js/shipper/common/cago/preview.js"></script>
</html>