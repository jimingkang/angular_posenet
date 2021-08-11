package com.example.demo;

import java.util.*;

public class Student {
    private String name;
    public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	private Set<String> book;
    public Set<String> getBook() {
		return book;
	}
	public void addBook(String book) {
        if (this.book == null) {
            this.book = new HashSet<>();
        }
        this.book.add(book);
    }
}
    //getters and setters
