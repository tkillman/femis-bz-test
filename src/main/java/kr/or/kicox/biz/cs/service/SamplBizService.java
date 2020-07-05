package kr.or.kicox.biz.cs.service;

import java.util.HashMap;
import java.util.List;

import kr.or.kicox.biz.cs.model.CSSearchVo;
import kr.or.kicox.biz.cs.model.JobBbsVo;

public interface SamplBizService {
	public int saveSamplBiz(JobBbsVo param) throws Exception;
	
	public int samplBizListCount(CSSearchVo searchCondition);
	
	public int deleteSamplBiz(JobBbsVo param);
	
	public List<HashMap<String, Object>> samplBizList(CSSearchVo searchCondition);
}
