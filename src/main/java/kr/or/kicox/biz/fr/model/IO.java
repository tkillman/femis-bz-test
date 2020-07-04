package kr.or.kicox.biz.fr.model;

import javax.servlet.http.HttpServletRequest;

import org.springframework.ui.ModelMap;
import org.springframework.web.servlet.ModelAndView;

public class IO {
	
	public static In in(HttpServletRequest request) {
		return new In(request);
	}

	public static Out out( ModelMap model) {
		return new Out(model);
	}

	public static Out out( ModelAndView mvn) {
		return new Out(mvn);
	}

	
}
