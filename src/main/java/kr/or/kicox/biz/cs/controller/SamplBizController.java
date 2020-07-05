package kr.or.kicox.biz.cs.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.or.kicox.biz.cs.model.CSSearchVo;
import kr.or.kicox.biz.cs.model.JobBbsVo;
import kr.or.kicox.biz.cs.service.SamplBizService;
import kr.or.kicox.biz.fr.exception.BizException;
import kr.or.kicox.biz.fr.model.IO;
import kr.or.kicox.biz.fr.model.In;
import kr.or.kicox.biz.fr.model.Out;
import kr.or.kicox.biz.fr.stat.View;
import kr.or.kicox.biz.fr.util.HashMapUtils;

@Controller("SamplBizController")
@RequestMapping("/cs" )
public class SamplBizController {
	
	@Resource(name="SamplBizService")
	SamplBizService samplBizService;
	
	@RequestMapping("/samplBiz/save.json" )
	public String save(HttpServletRequest request, ModelMap model) throws Exception {

		In in =  IO.in(request);

		JobBbsVo param = in.data("detailForm",JobBbsVo.class);

		int ret = samplBizService.saveSamplBiz(param);

		if( ret < 0 ) {
			throw new BizException("처리 중 오류가 발생했습니다.");
		}

		Out out = IO.out(model);
		out.data("result", true);

		return View.JSON;
	}
	
	@RequestMapping("/samplBiz/list.json" )
	public String list(HttpServletRequest request,  ModelMap model) throws Exception {

		In in = IO.in(request);
		Out out = IO.out(model);

		CSSearchVo searchCondition = in.data("searchCondition",CSSearchVo.class);
//		searchCondition.userInfo = SessionUtils.getUserInfo();

		searchCondition.totalCnt = samplBizService.samplBizListCount(searchCondition);
		
		out.data("searchCondition", searchCondition);
		out.dataset("samplBizListGrid", HashMapUtils.keyChangeLower(samplBizService.samplBizList(searchCondition)));
		return View.JSON;
	}
	
	@RequestMapping("/samplBiz/delete.json" )
	public String delete(HttpServletRequest request,  ModelMap model) throws Exception {

		In in = IO.in(request);
		Out out = IO.out(model);

		JobBbsVo param = in.data("param",JobBbsVo.class);
		samplBizService.deleteSamplBiz(param);

		out.data("result", true);

		return View.JSON;
	}
}
