package com.example.demo.Entiry;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Book 实体类
 *
 * Created by bysocket on 30/09/2017.
 */
@Entity
@Table(name = "book")
public class Book {

    /**
     * 编号
     */
    private Long id;

    private String url;
    private String tpl_name;
    private String abstr;
    /**
     * 书名
     */
    private String title;

    
    private String more_url;
    private String cover_url;
    private int ratingvalue;
    private int ratingcount;
    private int ratingstar_count;
    private String ratingrating_info;
    private String abstr_2;
    private String interest;
    private String extra_actions0color;
    private String extra_actions0text;
    private String extra_actions0url;
    @Column
    public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
	@Column
	public String getTpl_name() {
		return tpl_name;
	}

	public void setTpl_name(String tpl_name) {
		this.tpl_name = tpl_name;
	}
	@Column(name="abstract")
	public String getAbstr() {
		return abstr;
	}

	public void setAbstr(String abstr) {
		this.abstr = abstr;
	}
	@Column
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
	@Column
	public String getMore_url() {
		return more_url;
	}

	public void setMore_url(String more_url) {
		this.more_url = more_url;
	}
	@Column
	public String getCover_url() {
		return cover_url;
	}

	public void setCover_url(String cover_url) {
		this.cover_url = cover_url;
	}
	@Column
	public int getRatingvalue() {
		return ratingvalue;
	}

	public void setRatingvalue(int ratingvalue) {
		this.ratingvalue = ratingvalue;
	}
	@Column
	public int getRatingcount() {
		return ratingcount;
	}

	public void setRatingcount(int ratingcount) {
		this.ratingcount = ratingcount;
	}
	@Column
	public int getRatingstar_count() {
		return ratingstar_count;
	}

	public void setRatingstar_count(int ratingstar_count) {
		this.ratingstar_count = ratingstar_count;
	}
	@Column
	public String getRatingrating_info() {
		return ratingrating_info;
	}

	public void setRatingrating_info(String ratingrating_info) {
		this.ratingrating_info = ratingrating_info;
	}
	@Column(name="abstract_2")
	public String getAbstr_2() {
		return abstr_2;
	}

	public void setAbstr_2(String abstr_2) {
		this.abstr_2 = abstr_2;
	}
	@Column
	public String getInterest() {
		return interest;
	}

	public void setInterest(String interest) {
		this.interest = interest;
	}
	@Column
	public String getExtra_actions0color() {
		return extra_actions0color;
	}

	public void setExtra_actions0color(String extra_actions0color) {
		this.extra_actions0color = extra_actions0color;
	}
	@Column
	public String getExtra_actions0text() {
		return extra_actions0text;
	}

	public void setExtra_actions0text(String extra_actions0text) {
		this.extra_actions0text = extra_actions0text;
	}
@Column
	public String getExtra_actions0url() {
		return extra_actions0url;
	}

	public void setExtra_actions0url(String extra_actions0url) {
		this.extra_actions0url = extra_actions0url;
	}

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    
}
