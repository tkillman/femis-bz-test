package kr.or.kicox.biz.cs.service;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.kicox.biz.cs.mapper.SamplBizMapper;
import kr.or.kicox.biz.cs.model.CSSearchVo;
import kr.or.kicox.biz.cs.model.JobBbsVo;

@Service("SamplBizService")
public class SamplBizServiceImpl implements SamplBizService {

	@Resource(name = "SamplBizMapper")
	SamplBizMapper samplBizMapper;

	@Transactional
	@Override
	public int saveSamplBiz(JobBbsVo param) throws Exception {

		int ret = -1;
		if ("UPDATE".equals(param.getMode())) {
			ret = samplBizMapper.updateSamplBiz(param);
		} else {
			ret = samplBizMapper.insertSamplBiz(param);
		}
		
		return ret;
	}

	@Override
	public int samplBizListCount(CSSearchVo param) {
		return samplBizMapper.selectSamplBizListCount(param);
	}

	@Override
	public List<HashMap<String, Object>> samplBizList(CSSearchVo param) {
		return samplBizMapper.selectSamplBizList(param);
	}

	@Override
	public int deleteSamplBiz(JobBbsVo param) {
		return samplBizMapper.deleteSamplBiz(param);
	}
	
}
