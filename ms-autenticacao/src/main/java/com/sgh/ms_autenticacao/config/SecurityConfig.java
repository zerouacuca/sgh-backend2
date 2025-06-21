package com.sgh.ms_autenticacao.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // desabilita CSRF para facilitar testes com Postman
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll() // permite acesso público a /auth/*
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
