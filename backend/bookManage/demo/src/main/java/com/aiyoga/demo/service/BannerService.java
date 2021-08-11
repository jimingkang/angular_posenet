package com.aiyoga.demo.service;



import java.util.List;

import com.aiyoga.demo.entry.Banner;


/**
 * Banner 业务接口层
 *
 * Created by bysocket on 30/09/2017.
 */
public interface BannerService {
	
    /**
     * 获取所有 Banner
     */
    List<Banner> findAll();
    List<Banner> find(int page,int countsOnPage);

    /**
     * 新增 Banner
     *
     * @param Banner {@link Banner}
     */
    Banner insertByBanner(Banner Banner);

    /**
     * 更新 Banner
     *
     * @param Banner {@link Banner}
     */
    Banner update(Banner Banner);

    /**
     * 删除 Banner
     *
     * @param id 编号
     */
    Banner delete(Long id);

    /**
     * 获取 Banner
     *
     * @param id 编号
     */
    Banner findById(Long id);
}
