<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%--
@JspName     : samplBizDetailPopup.jsp
@Description : 실무사례공유 관리 팝업 - BA76012P
@author      : 김동규
@Modification Information
수정일      수정자    수정내용
------------------------------------------------------
2020.07.30 김동규  최초생성
--%>
<div class="layerpop winpop" style="width:608px">
	<div class="pop-wrap">
		<h3 class="pop-title">실무사례공유 작성</h3>
		<button type="button" class="pop-close" onclick="onClosing();">닫기</button>
		<div class="pop-content">
			<div class="pc-wrap">
				<h6 class="txt-type02">게시물 정보</h6>
				<input type="hidden" title="업무게시판관리번호" class="input-form" name="job_bbs_manage_no"/>
				<input type="hidden" title="상위업무게시판관리번호" class="input-form" name="upper_job_bbs_manage_no"/>
				<div class="tbl-frm mgt-10">
					<table>
						<caption>게시물 정보</caption>
						<colgroup>
							<col style="width:127px" />
							<col />
						</colgroup>
						<tbody>
							<tr>
								<th scope="row">제목 <strong>*</strong></th>
								<td colspan="3"><input type="text" title="제목" class="type-w100 input-form" name="bbs_sj_nm" required="required"/></td>
							</tr>
							<tr id="orgTxaRow" style="display:none;">
								<th scope="row">원문보기</th>
								<td colspan="3" id="orgTxa"></td>
							</tr>
							<tr>
								<th scope="row">내용 <strong>*</strong></th>
								<td colspan="3" id="txt-area"><textarea class="type-h03 input-form" title="내용" name="bbs_cn" id="bbs_cn" required="required" style="width:402px; !important;"></textarea></td>
							</tr>
							<tr>
								<th scope="row">첨부</th>
								<td colspan="3">
									<div class="btn-group mgt-5">
										<a href="javascript:;" class="btn-type-black" name="btnFileUp">파일찾기</a>
									</div>
									<div class="mgt-5 in-grid" data-atchmnfl-se-code="3" data-atchmnfl-ty-code="12" data-atchmnfl-manage-no>
										<table id="fileGrid"></table>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<h6 class="txt-type02 mgt-30" style="display:none;">댓글달기</h6>
				<div class="box-gray mgt-10" style="display:none;">
					<div class="tbl-infrm">
						<table>
							<colgroup>
								<col />
								<col style="width:67px"/>
							</colgroup>
							<tbody>
								<tr class="input-reply">
									<td class="agnR">
										<span class="txt-num">0/300</span>
										<input type="text" title="댓글 입력" name="answer_cn" style="width:400px"/>
										<a class="ico-del" name="btnAnswerDelete">삭제</a>
									</td>
									<td class="agnR">
										<a class="btn-type-navy" name="btnAnswerSave">등록</a>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<p class="line-type-01 mgt-20"></p>
					<p class="mgt-20" style="display:none" >총 <strong class="fc-org">0</strong>개의 댓글이 있습니다.</p>
					<div class="list-reply mgt-20" style="display:none">
						<ul name="answer_list">
						</ul>
					</div>
				</div>
			</div>
			<div class="btn-group algn-cntr mgt-20">
				<a href="javascript:;" class="btn-type-navy btn-pop" name="btnSave">저장</a>
				<a href="javascript:;" class="btn-type-dark btn-pop" name="btnDelete">삭제</a>
				<a href="javascript:;" class="btn-type-gray02 btn-pop" name="btnCancle">취소</a>
			</div>
		</div><!-- //pop-content -->
	</div><!-- //pop-wrap -->
</div>

<script type="text/javascript">
	$('[name=btnSave]').click(function(){
		onSave();
	})
	
	function onSave(){
		var detailForm = gfnFormToObject('.input-form');
		
		if (!validation()) return false;
		
		$T('/cs/samplBiz/save.json')
		.inData('detailForm', detailForm )
		.onLoad(function(d){
			onClosing();
		})
		.post();
	}
	
	function validation(){
		if(!gfnCheckValidation('[name=bbs_sj_nm]')) return false;
		
		return true;
	}
</script>