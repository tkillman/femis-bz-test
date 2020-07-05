package kr.or.kicox.biz.cs.model;

import kr.or.kicox.biz.fr.model.PageVo;

public class CSSearchVo extends PageVo {

	// Search Condition 휴일 관리
	public String from_de;
	public String to_de;
	public String cldr_de_se_code;

	// 공지사항
	public String inquiry_ty;			// 검색유형
	public String inquiry_word;			// 검색어
}
