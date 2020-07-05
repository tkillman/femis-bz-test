package kr.or.kicox.biz.cs.model;

import kr.or.kicox.biz.fr.model.CommonVo;

public class JobBbsVo extends CommonVo{

	private String passwd;
	private String name;
	private String id1;
	private String addr;
	private int unique_number;
	private String mode;
	
	public String getMode() {
		return mode;
	}
	public void setMode(String mode) {
		this.mode = mode;
	}
	public int getUnique_number() {
		return unique_number;
	}
	public void setUnique_number(int unique_number) {
		this.unique_number = unique_number;
	}
	public String getPasswd() {
		return passwd;
	}
	public void setPasswd(String passwd) {
		this.passwd = passwd;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getAddr() {
		return addr;
	}
	public void setAddr(String addr) {
		this.addr = addr;
	}
	public String getId1() {
		return id1;
	}
	public void setId1(String id1) {
		this.id1 = id1;
	}
}
