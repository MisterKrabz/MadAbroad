package com.patrickwang.MadAbroad.controller;

import com.patrickwang.MadAbroad.dto.AuthResponse;
import com.patrickwang.MadAbroad.dto.CompleteProfileRequest;
import com.patrickwang.MadAbroad.dto.MicrosoftTokenDto;
import com.patrickwang.MadAbroad.model.User;
import com.patrickwang.MadAbroad.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/microsoft-signin")
    public ResponseEntity<?> microsoftSignIn(@RequestBody MicrosoftTokenDto tokenDto) {
        try {
            AuthResponse authResponse = authService.processMicrosoftToken(tokenDto.getToken());
            return ResponseEntity.ok(authResponse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An internal error occurred.");
        }
    }

    @PostMapping("/complete-profile")
    public ResponseEntity<AuthResponse> completeProfile(
            @RequestBody CompleteProfileRequest request,
            @AuthenticationPrincipal User user
    ) {
        AuthResponse authResponse = authService.completeUserProfile(user, request.getName());
        return ResponseEntity.ok(authResponse);
    }
}