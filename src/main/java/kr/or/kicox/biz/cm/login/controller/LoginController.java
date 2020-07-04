package kr.or.kicox.biz.cm.login.controller;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class LoginController {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(LoginController.class);
	
    @RequestMapping(value = "/index.do")
    public String index(HttpServletRequest request, ModelMap model) {
    	
    	LOGGER.info("LoginController /index.do");
        model.addAttribute("contextPath", request.getContextPath());

        return "template/index";
    }
}
