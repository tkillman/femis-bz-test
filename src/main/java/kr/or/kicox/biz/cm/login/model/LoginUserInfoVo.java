package kr.or.kicox.biz.cm.login.model;

import java.io.Serializable;

import kr.or.kicox.biz.fr.util.StringUtils;

/**
 * @author 김충완
 *
 */
public class LoginUserInfoVo implements Serializable{

	/**로그인방       */
	public String loginMth;

	/**사용자명         */
	public String userNm;

	/**사용자ID         */
	public String userId;

	/**사용자IP         */
	private String userIp;

	/**사용자명         */
	public String emplyr_id;

	/**사용자ID         */
	public String emplyr_nm;

	/**사용자 조직코드  */
	public String orgnzt_code;

	/**사용자 조직코드명*/
	public String orgnzt_nm;

	public String orgnzt_ty_code;

	/**사용자 구분코드  */
	public String emplyr_se_code;

	/**사용자 구분코드명*/
	public String emplyr_se_nm;

	/**전자결재사용자ID*/
	public String elctrn_sanctn_emplyr_id;

	/**새올시스템사용자ID*/
	public String nusys_emplyr_id;

	/**사용자권한구분코드*/
	public String emplyr_author_se_code;

	public String issu_orgnzt_code;

	/**소속조직코드*/
	public String psitn_instt_code;

	/**소속기관구분코드*/
	public String psitn_instt_se_code;

	/**시스템사용여부*/
	public String sys_use_orgnzt_se_code;

	/**회사전화번호*/
	public String cmpny_telno;

	public String clsf_nm;

	public String adres_code;

	/**
	 * 관리자여부
	 */
	public boolean admin;

	/**이동전화번호*/
	public String mbtlnum;

	public String password_change_clos_de;

	public String password_encpt;

	public String brthdy;

	public String dept_nm;

	public String emladr;

	/** 비밀번호 변경 필요여부*/
	public String need_to_change_password_at;

	private String cmptncZone;

	private String cmptncZoneSeCode;

	private String roleCodes;

	/* 전자결재권자 여부*/
	private String decisionAt;

	/* (전자결재)시스템 사용 여부 */
	private String sysUseAt;

	//로그인 방법
	public String getLoginMth() {
		return loginMth;
	}

	public void setLoginMth(String loginMth) {
		this.loginMth = loginMth;
	}

	public String getSysUseAt() {
		return sysUseAt;
	}

	public void setSysUseAt(String sysUseAt) {
		this.sysUseAt = sysUseAt;
	}

	public String getDecisionAt() {
		return decisionAt;
	}

	public void setDecisionAt(String decisionAt) {
		this.decisionAt = decisionAt;
	}

	public String getRoleCodes() {
		return roleCodes;
	}

	public String getCmptncZoneCode() {
		if (StringUtils.isEmpty(cmptncZone)) {
			return null;
		}

		return cmptncZone.split(",")[0];
	}

	public String getCmptncZoneNm() {
		if (StringUtils.isEmpty(cmptncZone)) {
			return null;
		}

		final String[] split = cmptncZone.split(",");
		return split.length > 1 ? split[1].trim() : null;
	}

	public String getCmptncZoneSeCode() {
		return cmptncZoneSeCode;
	}

	public void setCmptncZoneSeCode(String cmptncZoneSeCode) {
		this.cmptncZoneSeCode = cmptncZoneSeCode;
	}

	public String getUserNm() {
		return userNm;
	}

	public void setUserNm(String userNm) {
		this.userNm = userNm;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserIp() {
		return userIp;
	}

	public void setUserIp(String userIp) {
		this.userIp = userIp;
	}

	public String getEmplyr_id() {
		return emplyr_id;
	}

	public void setEmplyr_id(String emplyr_id) {
		this.emplyr_id = emplyr_id;
	}

	public String getEmplyr_nm() {
		return emplyr_nm;
	}

	public void setEmplyr_nm(String emplyr_nm) {
		this.emplyr_nm = emplyr_nm;
	}

	public String getOrgnzt_code() {
		return orgnzt_code;
	}

	public void setOrgnzt_code(String orgnzt_code) {
		this.orgnzt_code = orgnzt_code;
	}

	public String getOrgnzt_nm() {
		return orgnzt_nm;
	}

	public void setOrgnzt_nm(String orgnzt_nm) {
		this.orgnzt_nm = orgnzt_nm;
	}

	public String getOrgnzt_ty_code() {
		return orgnzt_ty_code;
	}

	public void setOrgnzt_ty_code(String orgnzt_ty_code) {
		this.orgnzt_ty_code = orgnzt_ty_code;
	}

	public String getEmplyr_se_code() {
		return emplyr_se_code;
	}

	public void setEmplyr_se_code(String emplyr_se_code) {
		this.emplyr_se_code = emplyr_se_code;
	}

	public String getEmplyr_se_nm() {
		return emplyr_se_nm;
	}

	public void setEmplyr_se_nm(String emplyr_se_nm) {
		this.emplyr_se_nm = emplyr_se_nm;
	}

	public String getElctrn_sanctn_emplyr_id() {
		return elctrn_sanctn_emplyr_id;
	}

	public void setElctrn_sanctn_emplyr_id(String elctrn_sanctn_emplyr_id) {
		this.elctrn_sanctn_emplyr_id = elctrn_sanctn_emplyr_id;
	}

	public String getNusys_emplyr_id() {
		return nusys_emplyr_id;
	}

	public void setNusys_emplyr_id(String nusys_emplyr_id) {
		this.nusys_emplyr_id = nusys_emplyr_id;
	}

	public String getEmplyr_author_se_code() {
		return emplyr_author_se_code;
	}

	public void setEmplyr_author_se_code(String emplyr_author_se_code) {
		this.emplyr_author_se_code = emplyr_author_se_code;
	}

	public String getIssu_orgnzt_code() {
		return issu_orgnzt_code;
	}

	public void setIssu_orgnzt_code(String issu_orgnzt_code) {
		this.issu_orgnzt_code = issu_orgnzt_code;
	}

	public String getPsitn_instt_code() {
		return psitn_instt_code;
	}

	public void setPsitn_instt_code(String psitn_instt_code) {
		this.psitn_instt_code = psitn_instt_code;
	}

	public String getPsitn_instt_se_code() {
		return psitn_instt_se_code;
	}

	public void setPsitn_instt_se_code(String psitn_instt_se_code) {
		this.psitn_instt_se_code = psitn_instt_se_code;
	}

	public String getSys_use_orgnzt_se_code() {
		return sys_use_orgnzt_se_code;
	}

	public void setSys_use_orgnzt_se_code(String sys_use_orgnzt_se_code) {
		this.sys_use_orgnzt_se_code = sys_use_orgnzt_se_code;
	}

	public String getCmpny_telno() {
		return cmpny_telno;
	}

	public void setCmpny_telno(String cmpny_telno) {
		this.cmpny_telno = cmpny_telno;
	}

	public boolean isAdmin() {
		return admin;
	}

	public void setAdmin(boolean admin) {
		this.admin = admin;
	}

	public String getMbtlnum() {
		return mbtlnum;
	}

	public void setMbtlnum(String mbtlnum) {
		this.mbtlnum = mbtlnum;
	}

	public String getPassword_change_clos_de() {
		return password_change_clos_de;
	}

	public void setPassword_change_clos_de(String password_change_clos_de) {
		this.password_change_clos_de = password_change_clos_de;
	}

	public String getPassword_encpt() {
		return password_encpt;
	}

	public void setPassword_encpt(String password_encpt) {
		this.password_encpt = password_encpt;
	}

	public String getBrthdy() {
		return brthdy;
	}

	public void setBrthdy(String brthdy) {
		this.brthdy = brthdy;
	}

	public String getDept_nm() {
		return dept_nm;
	}

	public void setDept_nm(String dept_nm) {
		this.dept_nm = dept_nm;
	}

	public String getEmladr() {
		return emladr;
	}

	public void setEmladr(String emladr) {
		this.emladr = emladr;
	}

	public String getNeed_to_change_password_at() {
		return need_to_change_password_at;
	}

	public void setNeed_to_change_password_at(String need_to_change_password_at) {
		this.need_to_change_password_at = need_to_change_password_at;
	}

	public void setAdres_code(String adres_code) {
		this.adres_code = adres_code;
	}

	public String getAdres_code() {
		return adres_code;
	}

	@Override
	public String toString() {
		return "LoginUserInfoVo [userNm=" + userNm + ", userId=" + userId + ", emplyr_id=" + emplyr_id + ", emplyr_nm="
				+ emplyr_nm + ", orgnzt_code=" + orgnzt_code + ", orgnzt_nm=" + orgnzt_nm + ", orgnzt_ty_code="
				+ orgnzt_ty_code + ", emplyr_se_code=" + emplyr_se_code + ", emplyr_se_nm=" + emplyr_se_nm
				+ ", elctrn_sanctn_emplyr_id=" + elctrn_sanctn_emplyr_id + ", nusys_emplyr_id=" + nusys_emplyr_id
				+ ", emplyr_author_se_code=" + emplyr_author_se_code + ", issu_orgnzt_code=" + issu_orgnzt_code
				+ ", psitn_instt_code=" + psitn_instt_code + ", psitn_instt_se_code=" + psitn_instt_se_code
				+ ", sys_use_orgnzt_se_code=" + sys_use_orgnzt_se_code + ", cmpny_telno=" + cmpny_telno + ", admin=" + admin + ", mbtlnum="
				+ mbtlnum + ", password_change_clos_de=" + password_change_clos_de + ", password_encpt="
				+ password_encpt + ", brthdy=" + brthdy + ", dept_nm=" + dept_nm + ", emladr=" + emladr
				+ ", need_to_change_password_at=" + need_to_change_password_at + "]";
	}



}
