package com.aiyoga.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aiyoga.demo.entry.Artist;



public interface ArtistRepository extends JpaRepository<Artist, Long> {

}
