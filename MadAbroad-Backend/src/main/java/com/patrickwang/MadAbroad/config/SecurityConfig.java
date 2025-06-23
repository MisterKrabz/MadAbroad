package com.patrickwang.MadAbroad.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF protection, which is not needed for a stateless REST API.
            .csrf(csrf -> csrf.disable())
            
            // Define authorization rules.
            .authorizeHttpRequests(authz -> authz
                // Rule for GET requests:
                .requestMatchers(HttpMethod.GET, "/api/programs", "/api/programs/**").permitAll()
                // Rule for POST requests:
                .requestMatchers(HttpMethod.POST, "/api/programs").permitAll()
                // Rule for all other requests:
                .anyRequest().authenticated()
            )

            // We can add login form configuration here later.
            .httpBasic(withDefaults());

        return http.build();
    }
}