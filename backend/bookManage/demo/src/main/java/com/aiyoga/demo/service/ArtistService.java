package com.aiyoga.demo.service;



import java.util.List;

import com.aiyoga.demo.entry.Artist;


/**
 * Artist 业务接口层
 *
 * Created by bysocket on 30/09/2017.
 */
public interface ArtistService {
	
    /**
     * 获取所有 Artist
     */
    List<Artist> findAll();
    List<Artist> find(int page,int countsOnPage);

    /**
     * 新增 Artist
     *
     * @param Artist {@link Artist}
     */
    Artist insertByArtist(Artist Artist);

    /**
     * 更新 Artist
     *
     * @param Artist {@link Artist}
     */
    Artist update(Artist Artist);

    /**
     * 删除 Artist
     *
     * @param id 编号
     */
    Artist delete(Long id);

    /**
     * 获取 Artist
     *
     * @param id 编号
     */
    Artist findById(Long id);
}
