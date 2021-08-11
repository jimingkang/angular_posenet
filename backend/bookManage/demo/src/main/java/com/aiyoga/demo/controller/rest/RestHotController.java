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

import com.aiyoga.demo.entry.PlaylistTag;
import com.aiyoga.demo.entry.Hot;
import com.aiyoga.demo.entry.ReturnHot;
import com.aiyoga.demo.service.RestHotService;




@RestController

//@RequestMapping(value = "/playlist")
public class RestHotController {
	
	@Autowired
	public RestHotService  restHotService;
	@RequestMapping("/playlist/hot")
	public ReturnHot findAll() {
		List<Hot> list=restHotService.findAll();
		//model.addAttribute("hotList", list);
		list.stream().forEach(e->{
			PlaylistTag tag=new PlaylistTag();
			tag.setCategory(e.getPlaylisttagcategory());
			tag.setId(e.getPlaylisttagid());
			tag.setName(e.getPlaylisttagname());
			e.setPlaylistTag(tag);
			
		});
		//System.out.println(list);
		ReturnHot ret=new ReturnHot();
		ret.setTags(list);
		return ret;
		
	}
	@RequestMapping("/hot/list/{page}/{countsOnPage}")
	public List<Hot> findbyPage(@PathVariable int page,@PathVariable int countsOnPage) {
		List<Hot> list=restHotService.find(page,countsOnPage);
		
		return list;
		
	}
	@RequestMapping("/hot/{id}")
	public Hot findById(@PathVariable long id) {
		Hot list=restHotService.findById(id);
		
		return list;
		
	}
	
	
	@GetMapping("/savehot")
	public Hot savehot(Hot hot) {
		
		
		return restHotService.insertByHot(hot);
		
	}
	

}
