<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!-- 화주의 사이드바 메뉴를 표시하는 컴포넌트 -->
<div id="menu-shipper" class="menu-group">

	<a href="/client/member/dashboard/dashboard" class="menu-category no-arrow"
		style="display: flex; text-decoration: none; cursor: pointer; justify-content: center;">
		대시보드 </a>
	
	<div class="menu-category">수입 진행 관리</div>
	<ul class="sidebar-menu">
		<li><a href="/client/ims/imswrite/importBase">수입신고서 작성</a></li>
		<li><a href="/client/ims/status/list">수입신고 현황 조회</a></li>
	</ul>

	<div class="menu-category">수출 진행 관리</div>
	<ul class="sidebar-menu">
		<li><a href="/client/exp/expwrite/exportBase">수출신고서 작성</a></li>
		<li><a href="/client/exp/status/list">수출 신고 현황 조회</a></li>
	</ul>
	
	<div class="menu-category">화물/물류 정보</div>
	<ul class="sidebar-menu">
		<li><a href="/client/cargo/status/list">화물 진행정보 조회</a></li>
		<li><a href="/client/cargo/status/damagelist">예외처리 조회</a></li>
	</ul>
	
	<div class="menu-category">정보센터</div>
	<ul class="sidebar-menu">
		<li><a href="/client/information/notice/noticelist">공지사항</a></li>
		<li><a href="/client/information/announcement/announcement_list">행정예고</a></li>
		<li><a href="/client/information/complaint/complaint_list">민원사항</a></li>
	</ul>
	
</div>