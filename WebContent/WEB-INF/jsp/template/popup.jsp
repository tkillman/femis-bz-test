<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c"      uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form"   uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="ui"     uri="http://egovframework.gov/ctl/ui"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="xss" uri="http://localhost:8181/tld/xss" %>
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
<script defer="defer">

var _isPopup = true;
var _uuid = '${xss:avoid(param.p)}' || 'none';

$(function(){
	try {
		$.fnInit();
		//gfnPageInit();
		console.log('popup.jsp onLoad..', onLoad, _uuid);
		
		if (typeof onLoad != 'undefined') {
			if (window.opener && window.opener._popup[_uuid]) {
				onLoad(window.opener._popup[_uuid].data);
			} else if (window.parent && window.parent._popup[_uuid]) {
				onLoad(window.parent._popup[_uuid].data);
			} else if (_popup[_uuid]) {
				onLoad(_popup[_uuid].data);
			}
		} else {
			var href = window.location.href;
			if(href.indexOf('draft_yn=Y') != -1){

			}else{
				alert('팝업 부모 객체가 없습니다.');
			}
		}
	}
	finally {
		$('#do-not-hurry-up').addClass('loaded')[$.running > 0 ? 'fadeIn' : 'fadeOut']()

		window.location === window.parent.location &&
		$('.pop-title + .pop-close').length === 0 &&
		$('.pop-title').after('<button type="button" class="pop-close" onclick="(onClosing || window.close)()">닫기</button>')
	}
});

function onClosing(result){

	if(window.opener){ //팝업
		try {
			window.opener._gfnPopupCallback(_uuid,result,window);
		}
		catch (e) {
			window.opener.$error(e);
		}
		finally {
			window.close();
		}
	}else if(window.parent){ //iframe+레이어팝업
		window.parent.__afterBPopup = window.parent._gfnPopupCallback
		window.parent.__afterBPopupArgs = [_uuid, result]

		window.parent.$("#__popupLayer__").bPopup().close();
		//window.parent._gfnPopupCallback(_uuid,result);
	}else{
		alert('팝업 부모 객체가 없습니다.');
	}
}
</script>
</head>
<body id="here-is">
<div id="do-not-hurry-up"><div class="loading"></div></div>
<jsp:include page="<%=filePath%>"/>
<div id="__popupLayer__"><div class="__popupContent__"></div></div>
</body>
</html>



