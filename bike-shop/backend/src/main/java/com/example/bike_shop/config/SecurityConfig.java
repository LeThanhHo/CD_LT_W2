package com.example.bike_shop.config;

import com.example.bike_shop.security.JwtAuthenticationFilter;
import com.example.bike_shop.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("http://localhost:*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // 1. CÔNG KHAI (Không cần đăng nhập)
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/api/banners/**").permitAll() // Đã mở quyền cho Banners
                .requestMatchers(HttpMethod.POST, "/api/chat", "/api/contact").permitAll()
                
                // 2. DỮ LIỆU CÔNG KHAI CỦA SẢN PHẨM/BÀI VIẾT
                .requestMatchers(HttpMethod.GET, "/api/posts/**", "/api/posts").permitAll()
                .requestMatchers(HttpMethod.GET, 
                        "/api/products/**", "/api/categories/**", "/api/brands/**",
                        "/api/reviews/product/**", "/api/reviews/latest").permitAll()
                
                // 3. UPLOAD ẢNH (Đã mở cho người dùng đã đăng nhập để gửi Review)
                .requestMatchers("/api/upload/**").authenticated() 

                // 4. QUYỀN NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP
                .requestMatchers("/api/orders/**").authenticated()
                .requestMatchers("/api/cart/**").authenticated()
                .requestMatchers("/api/reviews/**").authenticated()
                .requestMatchers("/api/favorite/**").authenticated()
                .requestMatchers("/api/notification/**").authenticated()
                .requestMatchers("/api/users/me").authenticated()

                // 5. QUYỀN ADMIN (Giữ nguyên bảo mật cao)
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/reviews/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/reviews/*/reply").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/orders/*/status").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers("/api/users/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/products/**", "/api/categories/**", "/api/brands/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/products/**", "/api/categories/**", "/api/brands/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/products/**", "/api/categories/**", "/api/brands/**").hasRole("ADMIN")
                .requestMatchers("/api/posts/**").hasRole("ADMIN")
                .requestMatchers("/api/contact/**").hasRole("ADMIN")
                
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}