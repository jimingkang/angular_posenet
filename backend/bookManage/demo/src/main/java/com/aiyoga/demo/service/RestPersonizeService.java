package com.aiyoga.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.aiyoga.demo.entry.Personize;



@Service
public class RestPersonizeService {

	@Autowired
	public JpaRepository personizeRepository;
	public Personize saveUser(Personize banner) {
		Personize ret=null;
		ret=(Personize) personizeRepository.save(banner);
		return ret;
	}
	
	    public List<Personize> findAll() {
	        return personizeRepository.findAll();
	    }

	  
	    public Personize insertByPersonize(Personize Personize) {
	    	Personize ret=null;
			ret=(Personize) personizeRepository.save(Personize);
			return ret;
	    }

	   
	    public Personize update(Personize Personize) {
	       // Personize_DB.put(Personize.getId(), Personize);
	        personizeRepository.saveAndFlush(Personize);
	   
	        return Personize;
	    }

	  
	    public Personize delete(Long id) {
	         
	        Personize Personize=(Personize)personizeRepository.findById(id).get();
	        personizeRepository.deleteById(id);
	        		return Personize;
	    }

	  
	    public Personize findById(Long id) {
	    	 Personize Personize=(Personize)personizeRepository.findById(id).get();
	       
	         		return Personize;
	    }

		
		public List<Personize> find(int page, int countsOnPage) {
			PageRequest pageable=PageRequest.of(page, countsOnPage);
			
			
			return personizeRepository.findAll(pageable).getContent();
		}
}
