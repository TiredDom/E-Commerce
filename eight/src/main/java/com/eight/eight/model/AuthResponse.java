package com.eight.eight.model;


import lombok.Data;

@Data
public class AuthResponse {
    private boolean success;
    private String message;
    private String role;
}

