package com.example.demo.service;



import java.util.List;

import com.example.demo.Entiry.Book;

/**
 * Book 业务接口层
 *
 * Created by bysocket on 30/09/2017.
 */
public interface BookService {
	
    /**
     * 获取所有 Book
     */
    List<Book> findAll();
    List<Book> find(int page,int countsOnPage);

    /**
     * 新增 Book
     *
     * @param book {@link Book}
     */
    Book insertByBook(Book book);

    /**
     * 更新 Book
     *
     * @param book {@link Book}
     */
    Book update(Book book);

    /**
     * 删除 Book
     *
     * @param id 编号
     */
    Book delete(Long id);

    /**
     * 获取 Book
     *
     * @param id 编号
     */
    Book findById(Long id);
}
