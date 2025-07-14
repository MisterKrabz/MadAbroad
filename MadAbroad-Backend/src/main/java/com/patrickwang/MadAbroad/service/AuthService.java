package com.patrickwang.MadAbroad.service;

import java.util.Map;
import java.util.Optional;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.patrickwang.MadAbroad.dto.AuthResponse;
import com.patrickwang.MadAbroad.model.User;
import com.patrickwang.MadAbroad.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final JwtDecoder jwtDecoder;

    @Transactional
    public AuthResponse processMicrosoftToken(String token) {
        // 1. Decode and validate the Microsoft token
        Jwt decodedMicrosoftToken = jwtDecoder.decode(token);
        Map<String, Object> claims = decodedMicrosoftToken.getClaims();

        // 2. Extract required claims
        String email = (String) claims.getOrDefault("email", claims.get("preferred_username"));
        String oid = (String) claims.get("oid");
        String name = (String) claims.get("name");

        // 3. Validate email domain and ensure OID is present
        if (oid == null) {
            throw new IllegalArgumentException("Microsoft token is missing the required 'oid' claim.");
        }
        if (email == null || !email.toLowerCase().endsWith("@wisc.edu")) {
            throw new IllegalArgumentException("Access denied. Only @wisc.edu accounts are allowed.");
        }

        // 4. Find user by OID or create a new one. This logic is now clearer.
        Optional<User> existingUserOpt = userRepository.findByMicrosoftOid(oid);
        User user;
        boolean isNewUser;

        if (existingUserOpt.isPresent()) {
            user = existingUserOpt.get();
            isNewUser = false;
        } else {
            User newUser = new User();
            newUser.setMicrosoftOid(oid);
            newUser.setEmail(email);
            newUser.setName(name != null ? name : "New User"); // Set placeholder name if not provided
            user = userRepository.save(newUser);
            isNewUser = "New User".equals(user.getName());
        }

        // 5. Generate our application's internal JWT
        String appJwt = jwtService.generateToken(user.getEmail());

        // 6. Return the response
        return new AuthResponse(appJwt, user.getEmail(), user.getName(), isNewUser);
    }

    @Transactional
    public AuthResponse completeUserProfile(User user, String name) {
        if (user == null) {
            throw new IllegalStateException("User not found.");
        }
        user.setName(name);
        userRepository.save(user);

        String appJwt = jwtService.generateToken(user.getEmail());
        return new AuthResponse(appJwt, user.getEmail(), user.getName(), false);
    }
}