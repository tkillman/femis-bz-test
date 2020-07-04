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

<div class="content">
	<h3 class="content-title">실무사례공유</h3>
	<div class="top-search type04 mgt-10">
		<div class="tbl-frm">
			<div class="tbl-infrm">
				<table>
					<colgroup>
						<col style="width:70px"/>
						<col style="width:370px"/>
						<col style="width:70px"/>
						<col style="width:;"/>
					</colgroup>
					<tbody>
						<tr>
							<th scope="row">조회기간</th>
							<td>
								<input type="text" title="조회시작일" class="date-picker type-s02 schrCond" name="from_de" stype="date"/>
								<span class="txt">~</span>
								<input type="text" title="조회종료일" class="date-picker type-s02 schrCond" name="to_de" stype="date"/>
								<div class="agnM mgL-10"><span class="chk-box"><input class="schrCond" type="checkbox" id="chkPeriod" name="period_all" value="Y"/><label for="chkPeriod">전체</label></span></div>
							</td>
							<th scope="row">검색어</th>
							<td>
								<select title="검색구분" class="type-s02 schrCond" name="inquiry_ty">
									<option value="">- 전체 -</option>
									<option value="1">제목</option>
									<option value="2">작성자</option>
									<option value="3">내용</option>
								</select>
								<input type="text" title="검색어" class="type-m01 schrCond" name="inquiry_word"/>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="ts-btn">
			<div class="btn-group">
				<a href="javascript:;" class="btn-type-03" name="btnSearch">검색</a>
			</div>
		</div>
	</div>
	<div class="btn-group mgt-20">
		<a href="javascript:;" class="btn-type-dark btn-type-01" name="btnDelete">삭제</a>
		<a href="javascript:;" class="btn-type-navyline btn-type-01" name="btnWriteBbs">글작성</a>
		<a href="javascript:;" class="btn-type-navyline btn-type-01" name="btnAnswer">답변하기</a>
	</div>
	<div class="mgt-10">
		<table id="samplBizListGrid"></table>
		<div id="samplBizListGridPager"></div>
	</div>
</div>
<script type="text/javascript">

	$('[name=btnWriteBbs]').click(function(){
		popupDetail({'mode' : 'INSERT_R'});
	})
	
	//팝업
	function popupDetail(rowData, viewYn){
		const src = viewYn ? '/cs/samplBizViewPopup' : '/cs/samplBizDetailPopup';
		gfnPopup(src, '700', '800', rowData, onSearch, '실무사례상세');
	}
	
	function onSearch(){
		var searchCondition = gfnFormToObject('.schrCond'); //입력값
		console.log('searchCondition', searchCondition);
	}
</script>
</body>
</head>