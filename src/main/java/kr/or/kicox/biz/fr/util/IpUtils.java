package kr.or.kicox.biz.fr.util;

import javax.servlet.http.HttpServletRequest;

public class IpUtils {

	
	public static String getRequestIp(HttpServletRequest request) {
		
		String ret = request.getRemoteAddr();
		if(ret.indexOf(":")>-1 ) {
			//IPv6 - 길어서 에러가 발생할까봐. 짜름.
			return ret.substring(0, 15);
		}else {
			//IPv4
			return ret;
		}
		
	}
}
