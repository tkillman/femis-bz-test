package kr.or.kicox.biz.cs.service;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.kicox.biz.cs.mapper.SamplBizMapper;
import kr.or.kicox.biz.cs.model.JobBbsVo;

@Service("SamplBizService")
public class SamplBizServiceImpl implements SamplBizService {

	@Resource(name = "SamplBizMapper")
	SamplBizMapper samplBizMapper;

}
