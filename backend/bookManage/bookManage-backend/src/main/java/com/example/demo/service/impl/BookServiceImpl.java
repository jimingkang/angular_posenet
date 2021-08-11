package com.example.demo.service.impl;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.example.demo.Entiry.Book;
import com.example.demo.Entiry.User;
import com.example.demo.service.BookService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Book 业务层实现
 *
 * Created by jimmy on 30/09/2017.
 */
@Service
public class BookServiceImpl implements BookService {
	@Autowired
	public JpaRepository bookRepository;
    // 模拟数据库，存储 Book 信息
    // 第五章《﻿数据存储》会替换成 H2 数据源存储
   // private static Map<Long, Book> BOOK_DB = new HashMap<>();

    @Override
    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    @Override
    public Book insertByBook(Book book) {
    	Book ret=null;
		ret=(Book) bookRepository.save(book);
		return ret;
    }

    @Override
    public Book update(Book book) {
       // BOOK_DB.put(book.getId(), book);
        bookRepository.saveAndFlush(book);
   
        return book;
    }

    @Override
    public Book delete(Long id) {
         
        Book book=(Book)bookRepository.findById(id).get();
        bookRepository.deleteById(id);
        		return book;
    }

    @Override
    public Book findById(Long id) {
    	 Book book=(Book)bookRepository.findById(id).get();
       
         		return book;
    }

	@Override
	public List<Book> find(int page, int countsOnPage) {
		PageRequest pageable=PageRequest.of(page, countsOnPage);
		
		
		return bookRepository.findAll(pageable).getContent();
	}
}
