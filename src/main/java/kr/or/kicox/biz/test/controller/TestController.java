package kr.or.kicox.biz.test.controller;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/test")
public class TestController {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(TestController.class);
	
    @RequestMapping(value = "/sampleBiz.do")
    public String index(HttpServletRequest request, ModelMap model) {
    	
    	LOGGER.info("TestController /sampleBiz.do");
        model.addAttribute("contextPath", request.getContextPath());

        return "cs/sampleBiz";
    }
    
    public double sum(double a, double b){
        return a + b;
    }
}
