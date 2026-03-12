<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<!-- <title>Insert title here</title> -->
<jsp:include page="/WEB-INF/fragments/paprika/preStyle.jsp" />
</head>
<body>
<jsp:include page="/WEB-INF/fragments/paprika/header.jsp" />
<div class="main-body">
<jsp:include page="/WEB-INF/fragments/paprika/sidbar.jsp" />
	<sitemesh:write property="body" />
</div>
  <jsp:include page="/WEB-INF/fragments/paprika/footer.jsp" />
  <jsp:include page="/WEB-INF/fragments/paprika/postScript.jsp" />
</body>
</html>