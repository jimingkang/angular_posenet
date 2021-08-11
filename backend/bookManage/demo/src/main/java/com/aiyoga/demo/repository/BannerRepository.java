package com.aiyoga.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aiyoga.demo.entry.Banner;


public interface BannerRepository extends JpaRepository<Banner, Long> {

}
