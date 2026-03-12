/**
 * 
 */
document.addEventListener("DOMContentLoaded", function() {
	const targetGroup = document.getElementById("menu-shipper");
	if (targetGroup) {
		targetGroup.classList.add("active");
	}
});

function goDetail(brokerId) {
        if (!brokerId) {
            alert("잘못된 접근입니다.");
            return;
        }
        // 페이지 이동
        location.href = '/shipper/ims/broker/detail?id=' + brokerId;
    }