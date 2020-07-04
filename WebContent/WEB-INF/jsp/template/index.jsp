<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="xss" uri="http://localhost:8181/tld/xss" %>

<html lang="ko">
<head>
	<script src='http://code.jquery.com/jquery-2.2.3.min.js'></script>
	<script src="./js/common.js"></script>
</head>
<body>
	<!-- 테스트하고자 하는 jsp page include -->
	<jsp:forward page="/test/sampleBiz.do"></jsp:forward>
</body>
</head>