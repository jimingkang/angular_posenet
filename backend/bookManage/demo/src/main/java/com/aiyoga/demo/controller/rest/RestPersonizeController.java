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

import com.aiyoga.demo.entry.Personize;
import com.aiyoga.demo.entry.ReturnPersonize;
import com.aiyoga.demo.service.RestPersonizeService;
import com.aiyoga.demo.service.RestHotService;




@RestController

@RequestMapping
public class RestPersonizeController {
	
	@Autowired
	public RestPersonizeService  restPersonizeService;
	@RequestMapping("/personalized")
	public ReturnPersonize findAll() {
		List<Personize> list=restPersonizeService.findAll();
		//model.addAttribute("PersonizeList", list);
		//System.out.println(list);
		ReturnPersonize ret=new ReturnPersonize();
		ret.setResult(list);
		ret.setCode("200");
		ret.setCategory("0");
		ret.setHasTaste("false");
		return ret;
		
	}
	@RequestMapping("/personalized/list/{page}/{countsOnPage}")
	public List<Personize> findbyPage(@PathVariable int page,@PathVariable int countsOnPage) {
		List<Personize> list=restPersonizeService.find(page,countsOnPage);
		
		return list;
		
	}
	@RequestMapping("/personalized/{id}")
	public Personize findById(@PathVariable long id) {
		Personize list=restPersonizeService.findById(id);
		
		return list;
		
	}
	
	
	@GetMapping("/savePersonize")
	public Personize savePersonize(Personize Personize) {
		
		
		return restPersonizeService.insertByPersonize(Personize);
		
	}
	

}
