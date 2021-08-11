package com.aiyoga.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aiyoga.demo.entry.Banner;
import com.aiyoga.demo.entry.Personize;


public interface PersonizeRepository extends JpaRepository<Personize, Long> {

}
