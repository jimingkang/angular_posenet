package com.aiyoga.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.aiyoga.demo.entry.Hot;



@Service
public class RestHotService {

	@Autowired
	public JpaRepository hotRepository;
	public Hot saveUser(Hot hot) {
		Hot ret=null;
		ret=(Hot) hotRepository.save(hot);
		return ret;
	}
	
	    public List<Hot> findAll() {
	        return hotRepository.findAll();
	    }

	  
	    public Hot insertByHot(Hot hot) {
	    	Hot ret=null;
			ret=(Hot) hotRepository.save(hot);
			return ret;
	    }

	   
	    public Hot update(Hot Playlist_hot) {
	       // Playlist_hot_DB.put(Playlist_hot.getId(), Playlist_hot);
	        hotRepository.saveAndFlush(Playlist_hot);
	   
	        return Playlist_hot;
	    }

	  
	    public Hot delete(Long id) {
	         
	        Hot Playlist_hot=(Hot)hotRepository.findById(id).get();
	        hotRepository.deleteById(id);
	        		return Playlist_hot;
	    }

	  
	    public Hot findById(Long id) {
	    	 Hot Playlist_hot=(Hot)hotRepository.findById(id).get();
	       
	         		return Playlist_hot;
	    }

		
		public List<Hot> find(int page, int countsOnPage) {
			PageRequest pageable=PageRequest.of(page, countsOnPage);
			
			
			return hotRepository.findAll(pageable).getContent();
		}
}
