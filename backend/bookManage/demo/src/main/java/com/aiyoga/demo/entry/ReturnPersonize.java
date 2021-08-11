package com.aiyoga.demo.entry;

import java.util.*;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ReturnPersonize {
	public List getResult() {
		return result;
	}

	public void setResult(List result) {
		this.result = result;
	}

	private List result=null;
	
	private String hasTaste=null;
	private String code=null;
	private String category;
	public String getHasTaste() {
		return hasTaste;
	}

	public void setHasTaste(String hasTaste) {
		this.hasTaste = hasTaste;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

}
