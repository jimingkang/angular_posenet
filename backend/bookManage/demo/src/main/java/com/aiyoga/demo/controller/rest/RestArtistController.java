package com.aiyoga.demo.controller.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aiyoga.demo.entry.Artist;
import com.aiyoga.demo.entry.ReturnArtist;
import com.aiyoga.demo.service.RestArtistService;




@RestController

@RequestMapping
public class RestArtistController {
	
	@Autowired
	public RestArtistService  restArtistService;
	@RequestMapping("/artist/list")
	public ReturnArtist findAll(@RequestParam("cat") String cat) {
		List<Artist> list=restArtistService.findAll();
		//model.addAttribute("ArtistList", list);
		//System.out.println(list);
		ReturnArtist ban=new ReturnArtist();
		ban.setArtists(list);
		return ban;
		
	}
	@RequestMapping("/artist/list/{page}/{countsOnPage}")
	public List<Artist> findbyPage(@PathVariable int page,@PathVariable int countsOnPage) {
		List<Artist> list=restArtistService.find(page,countsOnPage);
		
		return list;
		
	}
	@RequestMapping("/artist/{id}")
	public Artist findById(@PathVariable long id) {
		Artist list=restArtistService.findById(id);
		
		return list;
		
	}
	
	
	@GetMapping("/saveArtist")
	public Artist saveArtist(Artist Artist) {
		
		
		return restArtistService.insertByArtist(Artist);
		
	}
	

}
