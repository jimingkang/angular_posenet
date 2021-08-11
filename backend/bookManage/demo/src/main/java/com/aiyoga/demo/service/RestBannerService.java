package com.aiyoga.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.aiyoga.demo.entry.Banner;



@Service
public class RestBannerService {

	@Autowired
	public JpaRepository bannerRepository;
	public Banner saveUser(Banner banner) {
		Banner ret=null;
		ret=(Banner) bannerRepository.save(banner);
		return ret;
	}
	
	    public List<Banner> findAll() {
	        return bannerRepository.findAll();
	    }

	  
	    public Banner insertByBanner(Banner Banner) {
	    	Banner ret=null;
			ret=(Banner) bannerRepository.save(Banner);
			return ret;
	    }

	   
	    public Banner update(Banner Banner) {
	       // Banner_DB.put(Banner.getId(), Banner);
	        bannerRepository.saveAndFlush(Banner);
	   
	        return Banner;
	    }

	  
	    public Banner delete(Long id) {
	         
	        Banner Banner=(Banner)bannerRepository.findById(id).get();
	        bannerRepository.deleteById(id);
	        		return Banner;
	    }

	  
	    public Banner findById(Long id) {
	    	 Banner Banner=(Banner)bannerRepository.findById(id).get();
	       
	         		return Banner;
	    }

		
		public List<Banner> find(int page, int countsOnPage) {
			PageRequest pageable=PageRequest.of(page, countsOnPage);
			
			
			return bannerRepository.findAll(pageable).getContent();
		}
}
