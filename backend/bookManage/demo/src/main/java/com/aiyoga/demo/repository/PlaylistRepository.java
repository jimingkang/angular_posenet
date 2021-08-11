package com.aiyoga.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aiyoga.demo.entry.Playlist;




public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

}
