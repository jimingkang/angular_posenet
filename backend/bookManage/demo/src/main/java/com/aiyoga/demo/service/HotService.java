package com.aiyoga.demo.service;



import java.util.List;

import com.aiyoga.demo.entry.Hot;


/**
 * Playlist_hot 业务接口层
 *
 * Created by bysocket on 30/09/2017.
 */
public interface HotService {
	
    /**
     * 获取所有 Playlist_hot
     */
    List<Hot> findAll();
    List<Hot> find(int page,int countsOnPage);

    /**
     * 新增 Playlist_hot
     *
     * @param Playlist_hot {@link Hot}
     */
    Hot insertByPlaylist_hot(Hot Playlist_hot);

    /**
     * 更新 Playlist_hot
     *
     * @param Playlist_hot {@link Hot}
     */
    Hot update(Hot Playlist_hot);

    /**
     * 删除 Playlist_hot
     *
     * @param id 编号
     */
    Hot delete(Long id);

    /**
     * 获取 Playlist_hot
     *
     * @param id 编号
     */
    Hot findById(Long id);
}
