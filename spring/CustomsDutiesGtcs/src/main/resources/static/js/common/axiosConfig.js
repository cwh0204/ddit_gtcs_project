/**
 * Axios 전역 인터셉터 설정
 */

axios.interceptors.request.use(
    function (config) {
        // 로컬 스토리지에서 저장된 토큰을 꺼내기
        const token = localStorage.getItem("accessToken");

        // 토큰이 존재한다면 헤더에 추가
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }

        return config;
    },
    function (error) {
        // 요청 에러 직전에 호출
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    function (response) {
        // 200번대 응답은 그대로 전달
        return response;
    },
    function (error) {
        // 401(미인증) 또는 403(권한없음) 에러가 오면 세션 만료 처리
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            
            // 토큰은 즉시 지우기
            localStorage.removeItem("accessToken");

            // SweetAlert2 적용
            Swal.fire({
                icon: 'warning',
                title: '인증 만료',
                text: '인증이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.',
                confirmButtonColor: '#3478f6',
                confirmButtonText: '확인',
                allowOutsideClick: false, // 바깥 배경을 눌러서 꺼지는 것을 방지
                heightAuto: false // 수정 : 이현규 / 이유 : 사이드바 짤림 현상 방지
            }).then((result) => {
                // 사용자가 '확인' 버튼을 클릭하면 로그인 페이지로 이동
                if (result.isConfirmed) {
                    window.location.href = "/member/auth/session/login"; 
                }
            });
        }
        return Promise.reject(error);
    }
);