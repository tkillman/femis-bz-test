package kr.or.kicox.biz.cm.menu.model;

import java.util.ArrayList;
import java.util.List;

import kr.or.kicox.biz.fr.model.CommonVo;
import kr.or.kicox.biz.fr.util.StringUtils;

/**
 * @Class Name  : MenuVo.java
 * @Description : 로그인시 메뉴정보 저장
 * @author      : 김충완
 * @Modification Information
 * 
 *  수정일      수정자   수정내용
 *  ---------------------------------------------------------------
 *  2019.11.26  김충완    최초생성
 *
 */ 
public class MenuLoginVo extends CommonVo {

	/**메뉴ID*/
	public String menu_id;

	/**상위메뉴아이디*/
	public String upper_menu_id;

	/**메뉴명*/
	public String menu_nm;

	/**메뉴URL주소*/
	public String menu_urladr;

	/**메뉴수준일련번호*/
	public String menu_level_sn;

	/**정렬일련번호*/
	public String sort_sn;

	/**사용여부*/
	public String use_at;

	public String lowest_menu_at;
	
	/**역할가능구분*/
	public String role_posbl_se_code;
	
	/**노출여부*/
	public String display_yn;
	
	public MenuLoginVo parent;
	
	public List<MenuLoginVo> children = new ArrayList<MenuLoginVo>();

	
	
	public String getMenu_id() {
		return menu_id;
	}



	public String getUpper_menu_id() {
		return upper_menu_id;
	}



	public String getMenu_nm() {
		return menu_nm;
	}



	public String getMenu_urladr() {
		return menu_urladr;
	}



	public String getMenu_level_sn() {
		return menu_level_sn;
	}



	public String getSort_sn() {
		return sort_sn;
	}



	public String getUse_at() {
		return use_at;
	}



	public String getLowest_menu_at() {
		return lowest_menu_at;
	}



	public String getRole_posbl_se_code() {
		return role_posbl_se_code;
	}



	public String getDisplay_yn() {
		return display_yn;
	}



	public MenuLoginVo getParent() {
		return parent;
	}



	public List<MenuLoginVo> getChildren() {
		return children;
	}


	public boolean isWritable() {
		if( StringUtils.isEquals(role_posbl_se_code , "1") )
			return true;
		return false;
	}

	@Override
	public String toString() {
		return "MenuLoginVo [menu_id=" + menu_id + ", upper_menu_id=" + upper_menu_id + ", menu_nm=" + menu_nm
				+ ", menu_urladr=" + menu_urladr + ", menu_level_sn=" + menu_level_sn + ", sort_sn=" + sort_sn
				+ ", use_at=" + use_at + ", lowest_menu_at=" + lowest_menu_at + ", role_posbl_se_code="
				+ role_posbl_se_code + ", display_yn=" + display_yn + "]";
	}


}
