package com.example.demo.controller.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.Mapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entiry.Book;
import com.example.demo.Entiry.User;
import com.example.demo.service.BookService;
import com.example.demo.service.RestBookService;

@RestController
//@CrossOrigin//(origins = "http://localhost:9000")
@RequestMapping(value = "/rest")
public class RestBookController {
	
	@Autowired
	public BookService bookService;
	@RequestMapping("/list")
	public List<Book> findAll() {
		List<Book> list=bookService.findAll();
		//model.addAttribute("bookList", list);
		//System.out.println(list);
		return list;
		
	}
	@RequestMapping("/list/{page}/{countsOnPage}")
	public List<Book> findbyPage(@PathVariable int page,@PathVariable int countsOnPage) {
		List<Book> list=bookService.find(page,countsOnPage);
		
		return list;
		
	}
	@RequestMapping("/book/{id}")
	public Book findById(@PathVariable long id) {
		Book list=bookService.findById(id);
		
		return list;
		
	}
	
	
	@GetMapping("/saveBook")
	public Book saveBook(Book book) {
		
		
		return bookService.insertByBook(book);
		
	}
	

}
