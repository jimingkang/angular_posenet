package com.example.demo.Entiry;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
@Entity
@Table(name = "andy")
public class User {

	private long uid;
    private String uname;
    
    public User() {
    	
    }
 public User(long id,String uname) {
    	this.uid=id;
    	this.uname=uname;
    }
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	 public long getUid() {
		return uid;
	}
	public void setUid(long uid) {
		this.uid = uid;
	}
	@Column(name = "uname", nullable = false)
	public String getUname() {
		return uname;
	}
	public void setUname(String uname) {
		this.uname = uname;
	}


}
