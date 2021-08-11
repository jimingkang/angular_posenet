package com.aiyoga.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aiyoga.demo.entry.Songlist;



public interface SonglistRepository extends JpaRepository<Songlist, Long> {

}
