package com.aiyoga.demo.entry;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
@Entity
@Table(name = "artist")
public class Artist {

	//private long uid;
   // private String uname;
    private long img1v1id;
    private String img1v1url;
    private String picurl;
    private long picid;
    private String name;
    private long id;
    private long accountid;

	public Artist() {
    	
    }

 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long getImg1v1id() {
		return img1v1id;
	}

	public void setImg1v1id(long img1v1id) {
		this.img1v1id = img1v1id;
	}
@Column
	public String getImg1v1url() {
		return img1v1url;
	}

	public void setImg1v1url(String img1v1url) {
		this.img1v1url = img1v1url;
	}
	@Column
	public String getPicurl() {
		return picurl;
	}

	public void setPicurl(String picurl) {
		this.picurl = picurl;
	}
	@Column
	public long getPicid() {
		return picid;
	}

	public void setPicid(long picid) {
		this.picid = picid;
	}
	@Column
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	@Column
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	@Column
	public long getAccountId() {
		return accountid;
	}

	public void setAccountId(long accountid) {
		this.accountid = accountid;
	}

	
	


}
