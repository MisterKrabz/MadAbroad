package com.patrickwang.MadAbroad.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String token) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true); // true for multipart

        String subject = "Verify Your MadAbroad Review";
        String verificationUrl = "http://localhost:8080/api/reviews/verify?token=" + token;
        String htmlContent = String.format("""
            <html>
                <body>
                    <h1>Thank you for your review!</h1>
                    <p>Please click the link below to post your review on MadAbroad. This link will expire in 30 minutes.</p>
                    <a href="%s" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 5px; padding: 10px 20px; background-color: #c5050c; display: inline-block;">Publish Review</a>
                    <p>If you did not submit this review, please disregard this email.</p>
                </body>
            </html>
        """, verificationUrl);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true); 

        mailSender.send(message);
    }
}