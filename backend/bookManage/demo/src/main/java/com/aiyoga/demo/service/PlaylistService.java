package com.aiyoga.demo.service;



import java.util.List;

import com.aiyoga.demo.entry.Playlist;


/**
 * Playlist 业务接口层
 *
 * Created by bysocket on 30/09/2017.
 */
public interface PlaylistService {
	
    /**
     * 获取所有 Playlist
     */
    List<Playlist> findAll();
    List<Playlist> find(int page,int countsOnPage);

    /**
     * 新增 Playlist
     *
     * @param Playlist {@link Playlist}
     */
    Playlist insertByPlaylist(Playlist Playlist);

    /**
     * 更新 Playlist
     *
     * @param Playlist {@link Playlist}
     */
    Playlist update(Playlist Playlist);

    /**
     * 删除 Playlist
     *
     * @param id 编号
     */
    Playlist delete(Long id);

    /**
     * 获取 Playlist
     *
     * @param id 编号
     */
    Playlist findById(Long id);
}
