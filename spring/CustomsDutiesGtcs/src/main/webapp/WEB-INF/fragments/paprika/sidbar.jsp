<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<aside class="sidebar">
	<button type="button" id="sidebarToggle" class="sidebar-btn">
        <i class="fas fa-angle-left"></i> </button>
	
	<jsp:include page="/WEB-INF/views/component/sidebarInfo/clientSidebar.jsp" />
	
</aside>

<script src="/js/sidebar/sidebar.js"></script>