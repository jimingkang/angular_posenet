package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.example.demo.Entiry.User;

@Service
public class RestBookService {

	@Autowired
	public JpaRepository userRepository;
	public User saveUser(User user) {
		User ret=null;
		ret=(User) userRepository.save(user);
		return ret;
	}
}
