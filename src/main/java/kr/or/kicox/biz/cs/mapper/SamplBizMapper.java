package kr.or.kicox.biz.cs.mapper;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import kr.or.kicox.biz.cs.model.CSSearchVo;
import kr.or.kicox.biz.cs.model.JobBbsVo;

@Mapper("SamplBizMapper")
public interface SamplBizMapper {
	
	public int insertSamplBiz(JobBbsVo param) throws Exception;
	public int updateSamplBiz(JobBbsVo param);
	public int deleteSamplBiz(JobBbsVo param);
	public int selectSamplBizListCount(CSSearchVo param);
	public List<HashMap<String, Object>> selectSamplBizList(CSSearchVo param);
	
}
