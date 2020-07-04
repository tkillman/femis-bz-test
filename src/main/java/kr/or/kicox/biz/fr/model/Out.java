package kr.or.kicox.biz.fr.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.ui.ModelMap;
import org.springframework.web.servlet.ModelAndView;

import kr.or.kicox.biz.fr.stat.View;

public class Out {
	
	private ModelMap model;
	private Map<String,Object> datas = new HashMap<String,Object>();
	private Map<String,List<Object>> datasets = new HashMap<String,List<Object>>();
	
	public Out( ModelMap model) {
		
		this.model = model;
		this.model.addAttribute("erroreCode", "");
		this.model.addAttribute("message", "");
		this.model.addAttribute("datas", this.datas);
		this.model.addAttribute("datasets", this.datasets);
	}
	
	public Out( ModelAndView mvn) {

		this.model = mvn.getModelMap();
		this.model.addAttribute("erroreCode", "");
		this.model.addAttribute("message", "");
		this.model.addAttribute("datas", this.datas);
		this.model.addAttribute("datasets", this.datasets);
		mvn.setViewName(View.JSON);
		
	}
	
	
	
	public void data(String name , Object obj) {
	
		this.datas.put(name, obj);
		
	}
	
	public void dataset(String name , List list) {
		
		this.datasets.put(name, list);
		
	}

	public void setErrorCode(String errorCode) {
		
		this.model.addAttribute("erroreCode", errorCode);
		
	}
	
//	public void setStatus(int status) {
//		
//		this.model.addAttribute("status", status);
//		
//		
//	}
	
	public void setMessage(String message) {
		
		this.model.addAttribute("message", message);

	}
	
}
