package com.aiyoga.demo.entry;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ReturnPlaylist {
	
	

	public Playlist getPlaylist() {
		return playlist;
	}

	public void setPlaylist(Playlist playlist) {
		this.playlist = playlist;
	}

	private Playlist playlist=null;
}
