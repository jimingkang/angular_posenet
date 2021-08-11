package com.aiyoga.demo.controller.rest;

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

import com.aiyoga.demo.entry.Banner;
import com.aiyoga.demo.entry.ReturnBanner;
import com.aiyoga.demo.service.RestBannerService;
import com.aiyoga.demo.service.RestHotService;




@RestController

@RequestMapping
public class RestBannerController {
	
	@Autowired
	public RestBannerService  restBannerService;
	@RequestMapping("/banner")
	public ReturnBanner findAll() {
		List<Banner> list=restBannerService.findAll();
		//model.addAttribute("BannerList", list);
		//System.out.println(list);
		ReturnBanner ban=new ReturnBanner();
		ban.setBanners(list);
		return ban;
		
	}
	@RequestMapping("/list/{page}/{countsOnPage}")
	public List<Banner> findbyPage(@PathVariable int page,@PathVariable int countsOnPage) {
		List<Banner> list=restBannerService.find(page,countsOnPage);
		
		return list;
		
	}
	@RequestMapping("/Banner/{id}")
	public Banner findById(@PathVariable long id) {
		Banner list=restBannerService.findById(id);
		
		return list;
		
	}
	
	
	@GetMapping("/saveBanner")
	public Banner saveBanner(Banner Banner) {
		
		
		return restBannerService.insertByBanner(Banner);
		
	}
	

}
