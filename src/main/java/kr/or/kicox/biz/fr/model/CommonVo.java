package kr.or.kicox.biz.fr.model;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class CommonVo implements Serializable{
	
	public String _status = "N";
	
	@JsonIgnore
	public String sessionUserId = "";
    
    public String get_status() {
        return _status;
    }
    
    public void set_status(String _status) {
        this._status = _status;
    }
    
    public String getSessionUserId() {
        return sessionUserId;
    }
    
    public void setSessionUserId(String sessionUserId) {
        this.sessionUserId = sessionUserId;
    }
}
