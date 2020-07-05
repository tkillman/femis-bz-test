package kr.or.kicox.biz.fr.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class PageVo {

	/**
	 * 페이지번호
	 */
	public int pageNo=1;

	
	/**
	 * 페이지사이즈, 한페이지에 노출되는 건수
	 */
	public int pageSize=20;
	
	
	/**
	 * 총건수. 페이징을 하기 위해서는 해당 값은 반드시 서버단에서 바인딩되어야 한다.
	 */
	public int totalCnt =0;
	
	
	/**
	 * 페이징번째 노출 index
	 * @return
	 */
	public int getStartNum() {
		return pageSize*(pageNo-1)+1;
	}
	
	/**
	 * 페이징시 마지막 노출 index
	 * @return
	 */
	public int getEndNum() {
		return pageSize*pageNo;
	}
	

	/**
	 * 페이지 총 갯수.
	 * @return
	 */
	public int getTotalPageCnt() {
		Double db =  Math.ceil( Double.valueOf(totalCnt)/Double.valueOf(pageSize) ); //올림
		return db.intValue();
	}
	
	/**
	 * 페이징용offset
	 * @return
	 */
	@JsonIgnore
	public int getOffset() {
		return getStartNum()-1;
	}

	public int getPageNo() {
		return pageNo;
	}

	public void setPageNo(int pageNo) {
		this.pageNo = pageNo;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public int getTotalCnt() {
		return totalCnt;
	}

	public void setTotalCnt(int totalCnt) {
		this.totalCnt = totalCnt;
	}
	
}
