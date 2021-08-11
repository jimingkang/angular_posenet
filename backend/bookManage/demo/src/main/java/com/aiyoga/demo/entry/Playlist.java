package com.aiyoga.demo.entry;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
@Entity
@Table(name = "playlist")
public class Playlist {

    private long id;
   private String description;
  
   // private String backgroundCoverUrl;
    private String coverImgUrl;
   // private long picid;
    private String name;
    private long userId;
   // private long accountid;
private List<Songlist> tracks;

@OneToMany
@JoinColumn(name = "pid")
	public List<Songlist> getTracks() {
	return tracks;
}
public void setTracks(List<Songlist> tracks) {
	this.tracks = tracks;
}
	public Playlist() {
    	
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
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	/*
	 * @Column public String getBackgroundCoverUrl() { return backgroundCoverUrl; }
	 * 
	 * public void setBackgroundCoverUrl(String backgroundCoverUrl) {
	 * this.backgroundCoverUrl = backgroundCoverUrl; }
	 */
	@Column
	public String getCoverImgUrl() {
		return coverImgUrl;
	}

	public void setCoverImgUrl(String coverImgUrl) {
		this.coverImgUrl = coverImgUrl;
	}
	/*
	 * @Column public long getPicid() { return picid; }
	 * 
	 * public void setPicid(long picid) { this.picid = picid; }
	 */

	public String getName() {
		return name;
	}
	@Column
	public void setName(String name) {
		this.name = name;
	}
	@Column
	public long getUserId() {
		return userId;
	}
	
	public void setUserId(long userId) {
		this.userId = userId;
	}
	/*
	 * @Column public long getAccountid() { return accountid; }
	 * 
	 * public void setAccountid(long accountid) { this.accountid = accountid; }
	 */

 
   
   

	
	
	


}
