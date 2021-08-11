package com.aiyoga.demo.entry;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "banner")
public class Banner {
	private int id;
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	private String imageurl;
	private String targetid;
	private String adid;
	private String targettype;
	private String color;
	private String typetitle;
	private String url;
	@Column
	public String getImageurl() {
		return imageurl;
	}
	public void setImageurl(String imageurl) {
		this.imageurl = imageurl;
	}
	@Column
	public String getTargetid() {
		return targetid;
	}
	public void setTargetid(String targetid) {
		this.targetid = targetid;
	}
	@Column
	public String getAdid() {
		return adid;
	}
	public void setAdid(String adid) {
		this.adid = adid;
	}
	@Column
	public String getTargettype() {
		return targettype;
	}
	public void setTargettype(String targettype) {
		this.targettype = targettype;
	}
	@Column
	public String gettitlecolor() {
		return color;
	}
	public void settitlecolor(String color) {
		this.color = color;
	}
	@Column
	public String gettypetitle() {
		return typetitle;
	}
	public void settypetitle(String typetitle) {
		this.typetitle = typetitle;
	}
	@Column
	public String geturl() {
		return url;
	}
	public void seturl(String url) {
		this.url = url;
	}
}
