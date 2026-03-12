document.addEventListener("DOMContentLoaded", function() {
    // === [기존 로직] 카테고리 아코디언 ===
    const categories = document.querySelectorAll('.sidebar .menu-category');
    
    categories.forEach(function(category) {
        category.addEventListener('click', function() {
            categories.forEach(function(otherCategory) {
                if (otherCategory !== category) {
                    otherCategory.classList.remove('active');
                    const otherMenu = otherCategory.nextElementSibling;
                    if (otherMenu && otherMenu.classList.contains('sidebar-menu')) {
                        otherMenu.style.maxHeight = null;
                        otherMenu.classList.remove('open');
                    }
                }
            });

            this.classList.toggle('active');
            const nextMenu = this.nextElementSibling;
            if (nextMenu && nextMenu.classList.contains('sidebar-menu')) {
                if (nextMenu.style.maxHeight) {
                    nextMenu.style.maxHeight = null;
                    nextMenu.classList.remove('open');
                } else {
                    nextMenu.style.maxHeight = nextMenu.scrollHeight + "px";
                    nextMenu.classList.add('open');
                }
            }
        });
    });

    // === [추가 로직] 사이드바 전체 토글 (접기/펴기) ===
    const sidebarToggle = document.getElementById('sidebarToggle');
    const body = document.body;

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            body.classList.toggle('collapsed');
            
            // 상태 저장 (새로고침/페이지 이동 시 유지)
            const isCollapsed = body.classList.contains('collapsed');
            localStorage.setItem('sidebar-collapsed', isCollapsed);
            
            // 데이터 표(Grid)가 있는 경우, 너비 변화에 맞춰 리사이즈 이벤트 발생
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 350);
        });
    }

    // 초기 로드 시 기존 상태(접힘 여부) 복원
    if (localStorage.getItem('sidebar-collapsed') === 'true') {
        body.classList.add('collapsed');
    }
});