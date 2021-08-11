package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entiry.Book;
import com.example.demo.Entiry.User;

public interface BookRepository extends JpaRepository<Book, Long> {

}
