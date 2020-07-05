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
				<input title="유니크번호" class="input-form" name="unique_number"/>
				<div class="tbl-frm mgt-10">
					<table>
						<caption>게시물 정보</caption>
						<colgroup>
							<col style="width:127px" />
							<col />
						</colgroup>
						<tbody>
							<tr>
								<th scope="row">아이디<strong>*</strong></th>
								<td colspan="3"><input type="text" title="아이디" class="type-w100 input-form" name="id1" required="required"/></td>
							</tr>
							<tr id="orgTxaRow" style="display:none;">
								<th scope="row">원문보기</th>
								<td colspan="3" id="orgTxa"></td>
							</tr>
							<tr>
								<th scope="row">주소<strong>*</strong></th>
								<td colspan="3" id="txt-area"><textarea class="type-h03 input-form" title="주소" name="addr" id="addr" required="required" style="width:402px; !important;"></textarea></td>
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
var oEditors = [];
var fileGrid;
var mode ="UPDATE";
var orgData;

	function onLoad(data){
		mode = data.mode;
		
		// button event bind
		console.log('SampleBizDetail onLoad', data);
		// 화면 오브젝트 세팅
		setForm(data);
		
		btnEventBind();
	}
	function btnEventBind(){
		
		//저장 버튼
		$('[name=btnSave]').click(function(){
			onSave();
		});
		
		// 취소 버튼 이벤트
		$('[name=btnCancle]').click(function(){
			onClosing();
		});
		
		// 삭제 버튼 이벤트
		$('[name=btnDelete]').click(function(){
			onDelete();
		});
	}

	function onSave(){
		var detailForm = gfnFormToObject('.input-form');
		detailForm.mode = mode;
		
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
	
	function setForm(d){
		// 넘어온 데이타 존재 하면 셋팅
		if(!$.isEmptyObject(d))
			gfnObjectToForm(d, '.input-form');
	}
	
	function onDelete(){
		var deleteData = gfnFormToObject('.input-form');
		
		if( confirm('삭제하시겠습니까?') ){
			$T('/cs/samplBiz/delete.json')
			.inData('param', deleteData )
			.onLoad(function(d){
				onClosing();
			})
			.post();
		}
	}
</script>