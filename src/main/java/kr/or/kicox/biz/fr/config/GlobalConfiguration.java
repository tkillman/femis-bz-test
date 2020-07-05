package kr.or.kicox.biz.fr.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
public class GlobalConfiguration {

    private static final Logger logger = LoggerFactory.getLogger(GlobalConfiguration.class);

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

}
