package test.controller;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import kr.or.kicox.biz.test.controller.TestController;

public class TestControllerTest {
	TestController c = null;
	
	@org.junit.Before
	public void setup() {
		c = new TestController();
	}
	
	@Test                                                                                
    public void testSum(){                                                        
        double result = c.sum(10, 50);                                     
        assertEquals(60, result, 0);                                           
    }
}
