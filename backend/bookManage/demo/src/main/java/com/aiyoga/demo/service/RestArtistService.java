package com.aiyoga.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.aiyoga.demo.entry.Artist;



@Service
public class RestArtistService {

	@Autowired
	public JpaRepository artistRepository;
	public Artist saveUser(Artist banner) {
		Artist ret=null;
		ret=(Artist) artistRepository.save(banner);
		return ret;
	}
	
	    public List<Artist> findAll() {
	        return artistRepository.findAll();
	    }

	  
	    public Artist insertByArtist(Artist Artist) {
	    	Artist ret=null;
			ret=(Artist) artistRepository.save(Artist);
			return ret;
	    }

	   
	    public Artist update(Artist Artist) {
	       // Artist_DB.put(Artist.getId(), Artist);
	        artistRepository.saveAndFlush(Artist);
	   
	        return Artist;
	    }

	  
	    public Artist delete(Long id) {
	         
	        Artist Artist=(Artist)artistRepository.findById(id).get();
	        artistRepository.deleteById(id);
	        		return Artist;
	    }

	  
	    public Artist findById(Long id) {
	    	 Artist Artist=(Artist)artistRepository.findById(id).get();
	       
	         		return Artist;
	    }

		
		public List<Artist> find(int page, int countsOnPage) {
			PageRequest pageable=PageRequest.of(page, countsOnPage);
			
			
			return artistRepository.findAll(pageable).getContent();
		}
}
