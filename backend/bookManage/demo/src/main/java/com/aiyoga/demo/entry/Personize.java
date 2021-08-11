package com.aiyoga.demo.entry;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "personize")
public class Personize {
	private long id;
	  private String name;
	 //  private String  category;
	  // private String usedcount;
	   private String type;
	   @JsonProperty("picUrl")
	   private String picurl;
	   private String copywriter;
	   @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
		public long getId() {
			return id;
		}
		public void setId(long id) {
			this.id = id;
		}
	   @Column
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	/*
	 * @Column public String getCategory() { return category; }
	 * 
	 * public void setCategory(String category) { this.category = category; }
	 */
	/*
	 * @Column public String getUsedcount() { return usedcount; }
	 * 
	 * public void setUsedcount(String usedcount) { this.usedcount = usedcount; }
	 */
	@Column
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	@Column
	public String getPicurl() {
		return picurl;
	}
	public void setPicurl(String picurl) {
		this.picurl = picurl;
	}
	@Column
	public String getCopywriter() {
		return copywriter;
	}
	public void setCopywriter(String copywriter) {
		this.copywriter = copywriter;
	}
	

	 
	
}
