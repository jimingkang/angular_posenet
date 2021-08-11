package com.aiyoga.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.aiyoga.demo.entry.Playlist;



@Service
public class RestPlaylistService {

	@Autowired
	public JpaRepository playlistRepository;
	public Playlist saveUser(Playlist banner) {
		Playlist ret=null;
		ret=(Playlist) playlistRepository.save(banner);
		return ret;
	}
	
	    public List<Playlist> findAll() {
	        return playlistRepository.findAll();
	    }

	  
	    public Playlist insertByPlaylist(Playlist Playlist) {
	    	Playlist ret=null;
			ret=(Playlist) playlistRepository.save(Playlist);
			return ret;
	    }

	   
	    public Playlist update(Playlist Playlist) {
	       // Playlist_DB.put(Playlist.getId(), Playlist);
	        playlistRepository.saveAndFlush(Playlist);
	   
	        return Playlist;
	    }

	  
	    public Playlist delete(Long id) {
	         
	        Playlist Playlist=(Playlist)playlistRepository.findById(id).get();
	        playlistRepository.deleteById(id);
	        		return Playlist;
	    }

	  
	    public Playlist findById(Long id) {
	    	 Playlist Playlist=(Playlist)playlistRepository.findById(id).get();
	       
	         		return Playlist;
	    }

		
		public List<Playlist> find(int page, int countsOnPage) {
			PageRequest pageable=PageRequest.of(page, countsOnPage);
			
			
			return playlistRepository.findAll(pageable).getContent();
		}
}
