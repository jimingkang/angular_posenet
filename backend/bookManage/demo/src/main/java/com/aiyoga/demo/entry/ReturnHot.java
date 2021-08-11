package com.aiyoga.demo.entry;

import java.util.*;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ReturnHot {
	public List getTags() {
		return tags;
	}

	public void setTags(List tags) {
		this.tags = tags;
	}
	@JsonProperty
	private List tags=null;

}
