package kr.or.kicox.biz.cs.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import kr.or.kicox.biz.cm.login.model.LoginUserInfoVo;
import kr.or.kicox.biz.fr.model.CommonVo;

public class JobBbsVo extends CommonVo{

	private String job_bbs_manage_no;		/* 업무게시판관리번호		*/
	private String cvpl_job_se_code;		/* 민원업무구분코드			*/
	private String cvpl_job_se_code_nm;		/* 민원업무구분				*/
	private String job_bbs_se_code;			/* 업무게시판구분코드		*/
	private String upper_job_bbs_manage_no;	/* 상위게시판일련번호		*/
	private String bbs_sj_nm;				/* 게시판제목명				*/
	private String bbs_cn;					/* 게시판내용				*/
	private String notice_estbs_se_code;	/* 공지설정구분코드			*/
	private String notice_use_at;			/* 공지사용여부				*/
	private String notice_begin_de;			/* 공지시작일자				*/
	private String notice_end_de;			/* 공지종료일자				*/
	private String bbs_urladr;				/* 게시판URL주소			*/
	private String notice_bbs_se_code;		/* 공지게시판구분코드		*/
	private String bbs_reqst_se_code;		/* 게시판신청구분코드		*/
	private String bbs_lct_se_code;			/* 게시판입지구분코드		*/
	private String bbs_cl_code;				/* 게시판분류코드			*/
	private String inqire_co;				/* 조회수					*/
	private String answer_at;				/* 답변여부					*/
	private String use_at;					/* 사용여부					*/
	private String frst_register_id;		/* 최초등록자ID				*/
	private String frst_regist_dt;			/* 최초등록일시				*/
	private String last_updusr_id;			/* 최종수정자ID				*/
	private String last_updt_dt;			/* 최종수정일시				*/
	private String mode;					/* 저장 모드				*/
	private String register_nm;				/* 작성자					*/

	private String atchmnfl_manage_no;		/* 첨부파일관리번호			*/

	private String answer_bbs_cn;			/* (답변 내용) bbs_cn 		*/

	private int answer_sn;     				/*댓글일련번호				*/
	private int upper_answer_sn;  		    /*상위댓글일련번호(미사용)	*/
	private String answer_cn;     			/*댓글내용					*/

	@JsonIgnore
	private LoginUserInfoVo userInfo;

	public String getJob_bbs_manage_no() {
		return job_bbs_manage_no;
	}

	public void setJob_bbs_manage_no(String job_bbs_manage_no) {
		this.job_bbs_manage_no = job_bbs_manage_no;
	}

	public String getCvpl_job_se_code() {
		return cvpl_job_se_code;
	}

	public void setCvpl_job_se_code(String cvpl_job_se_code) {
		this.cvpl_job_se_code = cvpl_job_se_code;
	}

	public String getCvpl_job_se_code_nm() {
		return cvpl_job_se_code_nm;
	}

	public void setCvpl_job_se_code_nm(String cvpl_job_se_code_nm) {
		this.cvpl_job_se_code_nm = cvpl_job_se_code_nm;
	}

	public String getJob_bbs_se_code() {
		return job_bbs_se_code;
	}

	public void setJob_bbs_se_code(String job_bbs_se_code) {
		this.job_bbs_se_code = job_bbs_se_code;
	}

	public String getUpper_job_bbs_manage_no() {
		return upper_job_bbs_manage_no;
	}

	public void setUpper_job_bbs_manage_no(String upper_job_bbs_manage_no) {
		this.upper_job_bbs_manage_no = upper_job_bbs_manage_no;
	}

	public String getBbs_sj_nm() {
		return bbs_sj_nm;
	}

	public void setBbs_sj_nm(String bbs_sj_nm) {
		this.bbs_sj_nm = bbs_sj_nm;
	}

	public String getBbs_cn() {
		return bbs_cn;
	}

	public void setBbs_cn(String bbs_cn) {
		this.bbs_cn = bbs_cn;
	}

	public String getNotice_estbs_se_code() {
		return notice_estbs_se_code;
	}

	public void setNotice_estbs_se_code(String notice_estbs_se_code) {
		this.notice_estbs_se_code = notice_estbs_se_code;
	}

	public String getNotice_use_at() {
		return notice_use_at;
	}

	public void setNotice_use_at(String notice_use_at) {
		this.notice_use_at = notice_use_at;
	}

	public String getNotice_begin_de() {
		return notice_begin_de;
	}

	public void setNotice_begin_de(String notice_begin_de) {
		this.notice_begin_de = notice_begin_de;
	}

	public String getNotice_end_de() {
		return notice_end_de;
	}

	public void setNotice_end_de(String notice_end_de) {
		this.notice_end_de = notice_end_de;
	}

	public String getBbs_urladr() {
		return bbs_urladr;
	}

	public void setBbs_urladr(String bbs_urladr) {
		this.bbs_urladr = bbs_urladr;
	}

	public String getNotice_bbs_se_code() {
		return notice_bbs_se_code;
	}

	public void setNotice_bbs_se_code(String notice_bbs_se_code) {
		this.notice_bbs_se_code = notice_bbs_se_code;
	}

	public String getBbs_reqst_se_code() {
		return bbs_reqst_se_code;
	}

	public void setBbs_reqst_se_code(String bbs_reqst_se_code) {
		this.bbs_reqst_se_code = bbs_reqst_se_code;
	}

	public String getBbs_lct_se_code() {
		return bbs_lct_se_code;
	}

	public void setBbs_lct_se_code(String bbs_lct_se_code) {
		this.bbs_lct_se_code = bbs_lct_se_code;
	}

	public String getBbs_cl_code() {
		return bbs_cl_code;
	}

	public void setBbs_cl_code(String bbs_cl_code) {
		this.bbs_cl_code = bbs_cl_code;
	}

	public String getInqire_co() {
		return inqire_co;
	}

	public void setInqire_co(String inqire_co) {
		this.inqire_co = inqire_co;
	}

	public String getAnswer_at() {
		return answer_at;
	}

	public void setAnswer_at(String answer_at) {
		this.answer_at = answer_at;
	}

	public String getUse_at() {
		return use_at;
	}

	public void setUse_at(String use_at) {
		this.use_at = use_at;
	}

	public String getFrst_register_id() {
		return frst_register_id;
	}

	public void setFrst_register_id(String frst_register_id) {
		this.frst_register_id = frst_register_id;
	}

	public String getFrst_regist_dt() {
		return frst_regist_dt;
	}

	public void setFrst_regist_dt(String frst_regist_dt) {
		this.frst_regist_dt = frst_regist_dt;
	}

	public String getLast_updusr_id() {
		return last_updusr_id;
	}

	public void setLast_updusr_id(String last_updusr_id) {
		this.last_updusr_id = last_updusr_id;
	}

	public String getLast_updt_dt() {
		return last_updt_dt;
	}

	public void setLast_updt_dt(String last_updt_dt) {
		this.last_updt_dt = last_updt_dt;
	}

	public String getMode() {
		return mode;
	}

	public void setMode(String mode) {
		this.mode = mode;
	}

	public String getRegister_nm() {
		return register_nm;
	}

	public void setRegister_nm(String register_nm) {
		this.register_nm = register_nm;
	}

	public String getAtchmnfl_manage_no() {
		return atchmnfl_manage_no;
	}

	public void setAtchmnfl_manage_no(String atchmnfl_manage_no) {
		this.atchmnfl_manage_no = atchmnfl_manage_no;
	}

	public String getAnswer_bbs_cn() {
		return answer_bbs_cn;
	}

	public void setAnswer_bbs_cn(String answer_bbs_cn) {
		this.answer_bbs_cn = answer_bbs_cn;
	}

	public int getAnswer_sn() {
		return answer_sn;
	}

	public void setAnswer_sn(int answer_sn) {
		this.answer_sn = answer_sn;
	}

	public int getUpper_answer_sn() {
		return upper_answer_sn;
	}

	public void setUpper_answer_sn(int upper_answer_sn) {
		this.upper_answer_sn = upper_answer_sn;
	}

	public String getAnswer_cn() {
		return answer_cn;
	}

	public void setAnswer_cn(String answer_cn) {
		this.answer_cn = answer_cn;
	}

	public LoginUserInfoVo getUserInfo() {
		return userInfo;
	}

	public void setUserInfo(LoginUserInfoVo userInfo) {
		this.userInfo = userInfo;
	}

}
