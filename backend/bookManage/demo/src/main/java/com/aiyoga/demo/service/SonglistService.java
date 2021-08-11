package com.aiyoga.demo.service;



import java.util.List;

import com.aiyoga.demo.entry.Songlist;


/**
 * Songlist 业务接口层
 *
 * Created by bysocket on 30/09/2017.
 */
public interface SonglistService {
	
    /**
     * 获取所有 Songlist
     */
    List<Songlist> findAll();
    List<Songlist> find(int page,int countsOnPage);

    /**
     * 新增 Songlist
     *
     * @param Songlist {@link Songlist}
     */
    Songlist insertBySonglist(Songlist Songlist);

    /**
     * 更新 Songlist
     *
     * @param Songlist {@link Songlist}
     */
    Songlist update(Songlist Songlist);

    /**
     * 删除 Songlist
     *
     * @param id 编号
     */
    Songlist delete(Long id);

    /**
     * 获取 Songlist
     *
     * @param id 编号
     */
    Songlist findById(Long id);
}
