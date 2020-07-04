package kr.or.kicox.biz.fr.util;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import kr.or.kicox.biz.cm.login.model.LoginUserInfoVo;
import kr.or.kicox.biz.cm.menu.model.MenuLoginVo;

public class SessionUtils {

	public static final String USER_INFO      = "userInfo";
	public static final String API_USER_INFO  = "apiUserInfo";
	public static final String MENU_INFO      = "menuInfo";
	public static final String TOP_MENU_INFO  = "topMenuInfo";

	/**
	 * 세션에 보관된 사용자ID를 리턴한다.
	 * @return
	 */
	public static String getSessionUserId() {

		LoginUserInfoVo userInfo = getUserInfo();
	    if(userInfo!=null) {
			return userInfo.userId;
		}
		return "";

	}


	public static String getSessionUserNm() {

		LoginUserInfoVo userInfo = getUserInfo();
	    if(userInfo!=null) {
			return userInfo.userNm;
		}
		return "";

	}

	/**
	 * 관리자 일 경우 true리턴.
	 * @return
	 */
	public static boolean isAdmin() {

		LoginUserInfoVo userInfo = getUserInfo();
		if( StringUtils.isEquals(userInfo.emplyr_author_se_code, "1")) {
			return true;
		}
		return false;

	}

	/**
	 * 로그인 유무를 리턴
	 * @return
	 */
	public static boolean isLogin() {
		LoginUserInfoVo userInfo =  getUserInfo();
		if(userInfo==null) {
			return false;
		}
		return true;
	}

	/**
	 * 전자결재 Api 로그인 유무를 리턴
	 * @return
	 */
	public static boolean isApiLogin() {
		LoginUserInfoVo apiUserInfo =  getApiUserInfo();
		if(apiUserInfo==null) {
			return false;
		}
		return true;
	}

	public static LoginUserInfoVo getApiUserInfo() {
		HttpSession session =  getSession();
		return (LoginUserInfoVo)session.getAttribute(API_USER_INFO);
	}

	public static LoginUserInfoVo getUserInfo() {
		HttpSession session =  getSession();
		return (LoginUserInfoVo)session.getAttribute(USER_INFO);
	}

	@SuppressWarnings("unchecked")
	public static List<MenuLoginVo> getMenuList() {
		HttpSession session =  getSession();
		return (List<MenuLoginVo>)session.getAttribute(MENU_INFO);
	}

	public static HttpSession getSession() {
	    return getRequest().getSession(true);
	}

	public static HttpServletRequest getRequest() {
		return ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest();
	}
}
