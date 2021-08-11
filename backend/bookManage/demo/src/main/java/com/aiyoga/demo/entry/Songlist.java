package com.aiyoga.demo.entry;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
@Entity
@Table(name = "songlist")
public class Songlist {
	private long id;
	private long pid;
	private String name;
	@Column
	 public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	@Column
	public long getPid() {
		return pid;
	}
	public void setPid(long pid) {
		this.pid = pid;
	}

}
