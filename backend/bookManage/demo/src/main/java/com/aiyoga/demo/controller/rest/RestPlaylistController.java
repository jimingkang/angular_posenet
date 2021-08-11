package com.aiyoga.demo.controller.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aiyoga.demo.entry.Playlist;
import com.aiyoga.demo.entry.ReturnPlaylist;
import com.aiyoga.demo.service.RestPlaylistService;




@RestController

//@RequestMapping(value = "/playlist")
public class RestPlaylistController {
	
	@Autowired
	public RestPlaylistService  restPlaylistService;
	@RequestMapping("/playlist/detail")
	public ReturnPlaylist findById(@RequestParam("id") long id) {
		Playlist playlist=restPlaylistService.findById(id);
		
		//System.out.println(list);
		ReturnPlaylist ret=new ReturnPlaylist();
		ret.setPlaylist(playlist);
		return ret;
		
	}
	@RequestMapping("/playlist/list/{page}/{countsOnPage}")
	public List<Playlist> findbyPage(@PathVariable int page,@PathVariable int countsOnPage) {
		List<Playlist> list=restPlaylistService.find(page,countsOnPage);
		
		return list;
		
	}
	@RequestMapping("/playlist/{id}")
	public Playlist findByPathId(@PathVariable long id) {
		Playlist list=restPlaylistService.findById(id);
		
		return list;
		
	}
	
	
	@GetMapping("/saveplaylist")
	public Playlist savehot(Playlist hot) {
		
		
		return restPlaylistService.insertByPlaylist(hot);
		
	}
	

}
