/**
 * js/dashboard.js
 * 수정된 대시보드 스크립트 (세액/물동량 탭 전환 + 웰컴 배너)
 */

// 전역 변수: 차트 인스턴스를 저장 (destroy 및 재생성을 위해 필요)
let dashboardChartInstance = null;

// [데이터] 차트 데이터 정의 (실제 개발 시에는 Ajax로 DB 데이터를 받아와야 함)
const dashboardData = {
    // 1. 납부 세액 데이터
    tax: {
        title: "월별 납부 세액 추이 (단위: 만원)",
        labels: ['9월', '10월', '11월', '12월', '1월', '2월'],
        datasets: [{
            label: '총 납부세액',
            data: [4500, 5200, 3800, 6100, 4200, 5500],
            backgroundColor: 'rgba(54, 162, 235, 0.7)', // 파란색
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            borderRadius: 4,
            type: 'bar',
            yAxisID: 'y',
        }]
    },
    // 2. 물동량 데이터 (복합 차트: 막대 + 선)
    volume: {
        title: "월별 수입 신고 건수 & 물동량",
        labels: ['9월', '10월', '11월', '12월', '1월', '2월'],
        datasets: [
            {
                label: '신고 건수 (건)',
                data: [120, 145, 110, 180, 130, 160],
                backgroundColor: 'rgba(255, 99, 132, 0.6)', // 빨간색 (투명도)
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                borderRadius: 4,
                type: 'bar', // 막대 그래프
                order: 2,    // 순서 (뒤)
                yAxisID: 'y', // 왼쪽 축
            },
            {
                label: '중량 (TON)',
                data: [1200, 1500, 1100, 2100, 1300, 1700],
                borderColor: '#0f4c81', // 남색 선
                backgroundColor: '#0f4c81',
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                type: 'line', // 꺾은선 그래프
                order: 1,     // 순서 (앞)
                yAxisID: 'y1', // 오른쪽 축 (이중축)
                tension: 0.2   // 선을 약간 부드럽게
            }
        ]
    }
};

// [함수] 차트 그리기 및 업데이트 함수
function renderDashboardChart(type) {
    const canvas = document.getElementById("mainDashboardChart");
    
    // 캔버스가 없으면 실행 중단 (오류 방지)
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const selectedData = dashboardData[type];

    // 1. 제목 업데이트 (HTML에 chartTitle ID가 있어야 함)
    const titleElem = document.getElementById('chartTitle');
    if(titleElem) titleElem.innerText = selectedData.title;

    // 2. 탭 버튼 스타일 업데이트
    document.querySelectorAll('.chart-tab').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(type === 'tax' ? 'btn-tax' : 'btn-vol');
    if(activeBtn) activeBtn.classList.add('active');

    // 3. 기존 차트가 있으면 삭제 (필수: 그래야 겹치지 않음)
    if (dashboardChartInstance) {
        dashboardChartInstance.destroy();
    }

    // 4. 새 차트 생성
    dashboardChartInstance = new Chart(ctx, {
        type: 'bar', // 기본 타입 (데이터셋에서 override 됨)
        data: {
            labels: selectedData.labels,
            datasets: selectedData.datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // 부모 컨테이너 높이에 맞춤
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: { position: 'bottom' }, // 범례 하단
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) { label += ': '; }
                            if (context.parsed.y !== null) {
                                // 숫자 3자리 콤마 포맷팅
                                label += new Intl.NumberFormat('ko-KR').format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    position: 'left',
                    grid: { borderDash: [2, 2], color: "#f0f0f0" },
                    title: { 
                        display: type === 'volume', 
                        text: '건수',
                        font: { size: 11 }
                    }
                },
                // 이중축 (물동량일 때만 활성화)
                y1: {
                    display: type === 'volume', 
                    position: 'right',
                    beginAtZero: true,
                    grid: { display: false },
                    title: { 
                        display: true, 
                        text: '중량(TON)',
                        font: { size: 11 }
                    }
                }
            }
        }
    });
}


// [초기화] DOM 로드 완료 시 실행
document.addEventListener("DOMContentLoaded", function () {
    
    // 1. 차트 초기 실행 (기본값: 납부 세액)
    // HTML에 버튼이 있다면 이벤트 리스너 연결
    const btnTax = document.getElementById('btn-tax');
    const btnVol = document.getElementById('btn-vol');

    if (btnTax && btnVol) {
        // 버튼 클릭 이벤트 연결
        btnTax.addEventListener('click', () => renderDashboardChart('tax'));
        btnVol.addEventListener('click', () => renderDashboardChart('volume'));
        
        // 초기 로딩
        renderDashboardChart('tax');
    } else {
        // 버튼이 없는 경우(이전 HTML 사용 시)를 대비해 그냥 차트만 그림
        renderDashboardChart('tax');
    }


    // 2. [기능 유지] 웰컴 배너 롤링 (기존 코드 유지)
    const tickerText = document.getElementById("tickerText");
    if (tickerText) {
        const messages = [
            `현재 미완료 전체 신고 건수는 총 <span class="txt-red">12건</span>입니다.`,
            `금일 신규 업무 <span class="txt-blue">45건</span>, 기한 임박 <span class="txt-orange">3건</span>입니다.`,
            `<span class="txt-bold">서류심사:</span> 대기 <span class="txt-orange">8</span> / 진행 <span class="txt-blue">15</span> / 완료 <span class="txt-green">120</span>`,
        ];
        let msgIndex = 0;
        function rotateMessage() {
            msgIndex = (msgIndex + 1) % messages.length;
            tickerText.classList.remove("flip-animate");
            void tickerText.offsetWidth; // 리플로우 강제 (애니메이션 재시작용)
            tickerText.innerHTML = messages[msgIndex];
            tickerText.classList.add("flip-animate");
        }
        setInterval(rotateMessage, 4000);
    }
});