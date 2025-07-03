package com.patrickwang.MadAbroad.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

// This class represents the JSON response from hCaptcha's siteverify API.
// We only care about the 'success' field, but we include others for completeness.
@JsonIgnoreProperties(ignoreUnknown = true)
public class HCaptchaVerificationResponse {

    private final boolean success;
    private final String challengeTs;
    private final String hostname;
    private final List<String> errorCodes;

    @JsonCreator
    public HCaptchaVerificationResponse(@JsonProperty("success") boolean success,
                                        @JsonProperty("challenge_ts") String challengeTs,
                                        @JsonProperty("hostname") String hostname,
                                        @JsonProperty("error-codes") List<String> errorCodes) {
        this.success = success;
        this.challengeTs = challengeTs;
        this.hostname = hostname;
        this.errorCodes = errorCodes;
    }

    public boolean isSuccess() {
        return success;
    }

}