package com.patrickwang.MadAbroad.service;

import com.patrickwang.MadAbroad.model.HCaptchaVerificationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class HCaptchaService {

    private final WebClient webClient;
    private final String hCaptchaSecret;

    // Inject the secret key from application.properties
    public HCaptchaService(@Value("${hcaptcha.secret-key}") String hCaptchaSecret) {
        this.hCaptchaSecret = hCaptchaSecret;
        this.webClient = WebClient.builder()
                .baseUrl("https://api.hcaptcha.com")
                .build();
    }

    /**
     * Verifies the hCaptcha token by making a server-to-server call.
     * @param token The 'h-captcha-response' token from the frontend.
     */
    public void verify(String token) {
        if (hCaptchaSecret == null || hCaptchaSecret.equals("YOUR_SECRET_KEY_HERE") || hCaptchaSecret.isEmpty()) {
            throw new RuntimeException("hCaptcha secret key is not configured.");
        }

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("response", token);
        formData.add("secret", hCaptchaSecret);

        HCaptchaVerificationResponse response = webClient.post()
                .uri("/siteverify")
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(HCaptchaVerificationResponse.class)
                .block(); // Block to get the result synchronously

        if (response == null || !response.isSuccess()) {
            throw new RuntimeException("CAPTCHA verification failed.");
        }
    }
}