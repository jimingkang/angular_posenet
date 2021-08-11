package com.aiyoga.demo.entry;

import java.util.*;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ReturnBanner {
	public List getBanners() {
		return banners;
	}

	public void setBanners(List banners) {
		this.banners = banners;
	}
	@JsonProperty
	private List banners=null;

}
