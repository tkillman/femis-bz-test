<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c"      uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form"   uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="ui"     uri="http://egovframework.gov/ctl/ui"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@page import="java.util.Map"%>
<%@page import="java.io.File"%>
<%@page import="java.sql.Timestamp"%>
<%
  /**
  * @Class Name : egovSampleList.jsp
  * @Description : Sample List 화면
  * @Modification Information
  *
  *   수정일         수정자                   수정내용
  *  -------    --------    ---------------------------
  *  2009.02.01            최초 생성
  *
  * author 실행환경 개발팀
  * since 2009.02.01
  *
  * Copyright (C) 2009 by MOPAS  All right reserved.
  */

  //MenuVo menuInfo = (MenuVo)request.getAttribute("menuInfo");
  //String filePath = ".."+File.separator+menuInfo.menu_urladr;

  	String filePath = ".."+File.separator+request.getAttribute("biz")+File.separator+request.getAttribute("fileName")+".jsp";

%>
<html lang="ko">
<head>
	<title>공장설립온라인지원시스템</title>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<script src="/js/lib.jquery.js"></script>
	<script src="/js/jquery.mask.min.js"></script>
	<script src="/js/jquery.jqgrid.min.js"></script>
	<script src="/js/jquery.monthpicker.min.js"></script>
	<script src="/js/jquery.inputmask.min.js" charset="utf-8"></script>
	<script src="/js/jquery.bpopup.min.js" charset="utf-8"></script>
	<script src="/js/xlsx.full.min.js"></script>
	<script src="/js/lib.common.min.js"></script>
	<script src="/js/common.js"></script>
<script defer="defer"></script>
</head>
<body id="here-is">
<jsp:include page="<%=filePath%>"/>
</body>
</html>



