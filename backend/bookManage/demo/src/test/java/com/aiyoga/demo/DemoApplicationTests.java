package com.aiyoga.demo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DemoApplicationTests {

	@Test
	void contextLoads() {
		
		//String sr="hello"; // sr-->"hello"  constrant pool;
		String str2=new String("hello");//hell0;  new String(); //heap
		
	}

}
