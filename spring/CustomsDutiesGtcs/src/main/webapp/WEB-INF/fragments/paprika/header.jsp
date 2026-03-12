<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>

<header class="global-header">
    <div class="header-center-group">
        <a href="/" class="logo"> 
            <i class="fas fa-globe" style="font-size: 25px; margin-right: 5px; margin-top: 2px"></i>
            G-TCS
        </a>
    </div>

    <jsp:include page="/WEB-INF/views/component/ticker.jsp" />

    <div class="header-right-area">
        
        <%-- 1. 로그인 된 상태 (초기에는 숨김) --%>
        <div id="header-auth-user" class="user-menu-wrapper" style="display: none;">
            <span class="header-user-name" style="font-size: 15px; margin-top: 1px;">
                <span id="headerUserName"></span>님 </span>
            
            <div class="user-menu-container">
                <a href="javascript:void(0);" class="menu-trigger" onclick="toggleUserMenu()">
                    <i class="fa-solid fa-bars"></i>
                </a>
                
                <div id="userDropdown" class="dropdown-content">
                    <div class="dropdown-info">
                        <span class="info-name">
                            <span id="dropdownUserName"></span>님 </span>
                        <span class="info-status">Logged in</span>
                    </div>
                    
                    <div class="dropdown-divider"></div>
                    
                    <a href="/client/member/memberdetail/detail" class="dropdown-item">
                        <i class="fa-solid fa-circle-user"></i> 회원 상세 정보
                    </a>
                    
                    <a href="javascript:void(0);" class="dropdown-item logout-item" onclick="jwtLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i> 로그아웃
                    </a>
                </div>
            </div>
        </div>

        <%-- 2. 로그인이 안 된 상태 (Guest) (초기에는 숨김) --%>
        <div id="header-auth-guest" class="guest-menu" style="display: none;">
            <a href="/member/auth/session/login" class="header-link login-btn">
                <i class="fa-solid fa-arrow-right-to-bracket"></i>
                <span>로그인</span>
            </a>
            <div class="v-divider-small"></div>
            <a href="/member/auth/signup/form" class="header-link signup-btn">
                <i class="fa-solid fa-user-plus"></i>
                <span>회원가입</span>
            </a>
        </div>
        
    </div>
</header>

<script>
(function() {
    // 1. JWT 파싱 함수 
    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error("Token parsing failed", e);
            return null;
        }
    }

    // 2. 헤더 UI 업데이트 로직
    window.updateHeaderUI = function() {
        const token = localStorage.getItem('accessToken');
        const userDiv = document.getElementById('header-auth-user');
        const guestDiv = document.getElementById('header-auth-guest');
        
        window.USER_CONTEXT = { memId: 0, memRole: 'GUEST', memName: '' };

        if (token) {
            const payload = parseJwt(token);
            if (payload && payload.realUser) {
                window.USER_CONTEXT = {
                    memId: payload.realUser.memId,
                    memRole: payload.realUser.memRole,
                    memName: payload.realUser.memName
                };

                const nameText = payload.realUser.memName;
                const headerUserName = document.getElementById('headerUserName');
                const dropdownUserName = document.getElementById('dropdownUserName');
                
                if(headerUserName) headerUserName.textContent = nameText;
                if(dropdownUserName) dropdownUserName.textContent = nameText;

                if(userDiv) userDiv.style.display = 'flex';
                if(guestDiv) guestDiv.style.display = 'none';
                
                if(typeof axios !== 'undefined') {
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
                } else if(window.axios) {
                    window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
                }
                
                console.log("헤더 업데이트 완료:", window.USER_CONTEXT);
                return;
            }
        }

        if(userDiv) userDiv.style.display = 'none';
        if(guestDiv) guestDiv.style.display = 'flex';
    };

    // 3. 페이지 로드 시 실행
    document.addEventListener('DOMContentLoaded', window.updateHeaderUI);

    // 추가 1: 다른 탭/창에서 토큰이 변경되었을 때 즉시 감지
    window.addEventListener('storage', function(e) {
        if (e.key === 'accessToken') {
            window.updateHeaderUI();
        }
    });

    // 추가 2: "같은 창"에서 토큰이 변경되었을 때 즉시 감지하는 특수 코드
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments); // 원래의 저장 기능 먼저 실행
        
        // 저장이 완료되면 'local-storage-changed'라는 커스텀 이벤트 강제 발생
        const event = new CustomEvent('local-storage-changed', { detail: { key: key } });
        window.dispatchEvent(event);
    };

    // 특수 코드에서 발생시킨 이벤트를 듣고 있다가 헤더 새로고침
    window.addEventListener('local-storage-changed', function(e) {
        if (e.detail.key === 'accessToken') {
            console.log("같은 창 내 토큰 변경 감지 헤더 즉시 갱신");
            window.updateHeaderUI();
        }
    });
})();

// ===================== 전역 함수 (외부 호출용) =====================

function toggleUserMenu() {
    const dropdown = document.getElementById("userDropdown");
    if (dropdown) {
        dropdown.classList.toggle("show");
    }
}

window.addEventListener('click', function(event) {
    if (!event.target.matches('.menu-trigger') && !event.target.matches('.fa-bars')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
});

function jwtLogout() {
    Swal.fire({
        title: '로그아웃 하시겠습니까?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6', // 필요에 따라 기존 UI에 맞는 색상으로 변경
        cancelButtonColor: '#d33',
        confirmButtonText: '로그아웃',
        cancelButtonText: '취소',
        
        // CSS 충돌 및 레이아웃 틀어짐 방지 핵심 옵션
        heightAuto: false, 

    }).then((result) => {
        // 사용자가 '로그아웃' 버튼을 눌렀을 때
        if (result.isConfirmed) {
            localStorage.removeItem('accessToken'); 
            
            Swal.fire({
                title: '로그아웃 되었습니다.',
                icon: 'success',
                confirmButtonText: '확인',
                heightAuto: false
            }).then(() => {
                // 확인 버튼을 누르거나 창이 닫힌 후 메인으로 이동
                window.location.href = "/"; 
            });
        }
    });
}

const initGlobalSSE = (eventNames, callbackFunction) => { 
    const memId = (window.USER_CONTEXT && window.USER_CONTEXT.memId) || 0;
    if (memId === 0) return;

    if (window.globalEventSource) {
        window.globalEventSource.close();
    }

    const eventSource = new EventSource('/rest/sse/stream?memId=' + memId);
    window.globalEventSource = eventSource; 

    const events = Array.isArray(eventNames) ? eventNames : [eventNames];

    events.forEach(eventName => {
        eventSource.addEventListener(eventName, (event) => {
            console.log(`[공통 SSE 감지] ${eventName} 데이터 변경이 감지되었습니다.`);
            setTimeout(() => {
                if (typeof callbackFunction === 'function') {
                    callbackFunction(); 
                }
            }, 2000);
        });
    });

    eventSource.addEventListener('CONNECT', (event) => {});
    
    eventSource.addEventListener('SHUTDOWN', (event) => {
        console.log("[SSE] 서버 셧다운 감지! 브라우저의 자동 재연결을 차단합니다.");
        eventSource.close(); 
    });
    
    eventSource.onerror = (error) => {};
    window.addEventListener('beforeunload', () => {
        eventSource.close();
    });
};
</script>