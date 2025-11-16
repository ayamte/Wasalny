package com.wasalny.auth.responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupResponse {
    private String message;
    private String email;

    public SignupResponse(String message, String email) {
        this.message = message;
        this.email = email;
    }
}
