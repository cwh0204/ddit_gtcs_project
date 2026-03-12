<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div id="menu-shipper" class="menu-group">

	<div id="shipper-only-menu" style="display: none;">
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
	</div>

	<div id="common-menu" style="display: none;">
		<div class="menu-category">정보센터</div>
		<ul class="sidebar-menu">
			<li><a href="/client/information/notice/noticelist">공지사항</a></li>
			<li><a href="/client/information/announcement/announcement_list">행정예고</a></li>
			<li id="menu-complaint"><a href="/client/information/complaint/complaint_list">민원사항</a></li>
		</ul>
	</div>
	
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem('accessToken');
    
    // 제어할 메뉴 요소들을 가져옵니다.
    const commonMenu = document.getElementById('common-menu');
    const complaintMenu = document.getElementById('menu-complaint'); 

    // [비로그인 상태] 토큰이 없을 때
    if (!token) {
        if(commonMenu) commonMenu.style.display = 'block'; // 정보센터 카테고리는 보여주고
        if(complaintMenu) complaintMenu.style.display = 'none'; // 민원사항 항목만 숨김.
        return; // 아래의 로그인 확인 로직은 타지 않고 여기서 멈춤.
    }

    // [로그인 상태] 토큰이 있을 때
    if (token) {
        function parseJwt(token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                return JSON.parse(jsonPayload);
            } catch(e) {
                console.error("사이드바 토큰 파싱 에러:", e);
                return null;
            }
        }

        const payload = parseJwt(token);
        
        if (payload && payload.realUser && payload.realUser.memRole) {
            const role = payload.realUser.memRole.toUpperCase(); 

            const shipperMenu = document.getElementById('shipper-only-menu');

            if (role === 'SHIPPER') {
                if(shipperMenu) shipperMenu.style.display = 'block';
                if(commonMenu) commonMenu.style.display = 'block';
                if(complaintMenu) complaintMenu.style.display = 'block'; // 화주에게는 민원사항 노출
            } else if (role === 'GUEST') {
                if(commonMenu) commonMenu.style.display = 'block';
                if(complaintMenu) complaintMenu.style.display = 'none'; // 로그인한 GUEST에게도 민원사항 숨김
            }
        }
    }
});
</script>