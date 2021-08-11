package com.aiyoga.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.aiyoga.demo.entry.Songlist;



@Service
public class RestSonglistService {

	@Autowired
	public JpaRepository songlistRepository;
	public Songlist saveUser(Songlist banner) {
		Songlist ret=null;
		ret=(Songlist) songlistRepository.save(banner);
		return ret;
	}
	
	    public List<Songlist> findAll() {
	        return songlistRepository.findAll();
	    }

	  
	    public Songlist insertBySonglist(Songlist Songlist) {
	    	Songlist ret=null;
			ret=(Songlist) songlistRepository.save(Songlist);
			return ret;
	    }

	   
	    public Songlist update(Songlist Songlist) {
	       // Songlist_DB.put(Songlist.getId(), Songlist);
	        songlistRepository.saveAndFlush(Songlist);
	   
	        return Songlist;
	    }

	  
	    public Songlist delete(Long id) {
	         
	        Songlist Songlist=(Songlist)songlistRepository.findById(id).get();
	        songlistRepository.deleteById(id);
	        		return Songlist;
	    }

	  
	    public Songlist findById(Long id) {
	    	 Songlist Songlist=(Songlist)songlistRepository.findById(id).get();
	       
	         		return Songlist;
	    }

		
		public List<Songlist> find(int page, int countsOnPage) {
			PageRequest pageable=PageRequest.of(page, countsOnPage);
			
			
			return songlistRepository.findAll(pageable).getContent();
		}
}
