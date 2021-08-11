package com.aiyoga.demo.entry;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ReturnArtist {
	public List getArtists() {
		return artists;
	}

	public void setArtists(List artists) {
		this.artists = artists;
	}
	
	private List artists=null;

}
