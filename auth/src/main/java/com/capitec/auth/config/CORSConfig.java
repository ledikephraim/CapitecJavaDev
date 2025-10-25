package com.capitec.auth.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
@Configuration
public class CORSConfig {

    @Value("${spring.web.cors.allowed-origins:*}")
    private String[] allowedOrigins;

    @Value("${spring.web.cors.allowed-methods:GET,POST,PUT,DELETE,OPTIONS}")
    private String[] allowedMethods;

    @Value("${spring.web.cors.allowed-headers:*}")
    private String[] allowedHeaders;

    @Value("${spring.web.cors.allow-credentials:true}")
    private boolean allowCredentials;

    @Value("${spring.web.cors.max-age:3600}")
    private Long maxAge;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(allowedOrigins));
        config.setAllowedMethods(Arrays.asList(allowedMethods));
        config.setAllowedHeaders(Arrays.asList(allowedHeaders));
        config.setAllowCredentials(allowCredentials);
        config.setMaxAge(maxAge);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
