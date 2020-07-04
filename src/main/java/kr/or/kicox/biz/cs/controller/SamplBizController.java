package kr.or.kicox.biz.cs.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.or.kicox.biz.cs.model.JobBbsVo;
import kr.or.kicox.biz.fr.exception.BizException;
import kr.or.kicox.biz.fr.model.IO;
import kr.or.kicox.biz.fr.model.In;
import kr.or.kicox.biz.fr.model.Out;
import kr.or.kicox.biz.fr.stat.View;
import kr.or.kicox.biz.fr.util.SessionUtils;

@Controller("SamplBizController")
@RequestMapping("/cs" )
public class SamplBizController {

	@RequestMapping("/samplBiz/save.json" )
	public String save(HttpServletRequest request, ModelMap model) throws Exception {

		In in =  IO.in(request);

		JobBbsVo param = in.data("detailForm",JobBbsVo.class);
		param.setUserInfo(SessionUtils.getUserInfo());

		int ret = 1;
		//int ret = samplBizService.saveSamplBiz(param);

		if( ret < 0 ) {
			throw new BizException("처리 중 오류가 발생했습니다.");
		}


		Out out = IO.out(model);
		out.data("result", true);

		return View.JSON;
	}
}
