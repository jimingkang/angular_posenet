package com.aiyoga.demo.entry;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Book 实体类
 *
 * Created by bysocket on 30/09/2017.
 */
@Entity
@Table(name = "playlist_hot")
public class Hot {

    /**
     * 编号
     */
	@JsonIgnore
	private long playlisttagid;
	@JsonIgnore
	private String playlisttagname;
	@JsonIgnore
	private String playlisttagcategory;
	
	//@JsonProperty
    private Long id;
	//@JsonProperty
    private String name;
	//@JsonProperty
    private String type;
    @JsonProperty
     PlaylistTag playlistTag=null;
	
     @Transient
	public PlaylistTag getPlaylistTag() {
		return playlistTag;
	}

	public void setPlaylistTag(PlaylistTag playlistTag) {
		this.playlistTag = playlistTag;
	}

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	public long getPlaylisttagid() {
		return playlisttagid;
	}

	public void setPlaylisttagid(long playlisttagid) {
		this.playlisttagid = playlisttagid;
	}
@Column
	public String getPlaylisttagname() {
		return playlisttagname;
	}

	public void setPlaylisttagname(String playlisttagname) {
		this.playlisttagname = playlisttagname;
	}
	@Column
	public String getPlaylisttagcategory() {
		return playlisttagcategory;
	}

	public void setPlaylisttagcategory(String playlisttagcategory) {
		this.playlisttagcategory = playlisttagcategory;
	}
	@Column
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}
	@Column
	public void setType(String type) {
		this.type = type;
	}



    @Column
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    
}
