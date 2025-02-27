package com.eight.eight.service;

import com.eight.eight.model.*;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class UserService {
    private final Map<String, User> users = new ConcurrentHashMap<>();

    public AuthResponse register(RegisterRequest request) {
        AuthResponse response = new AuthResponse();
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            response.setSuccess(false);
            response.setMessage("Passwords do not match.");
            return response;
        }

        if (users.containsKey(request.getEmail())) {
            response.setSuccess(false);
            response.setMessage("User already exists.");
            return response;
        }

        String role = request.getEmail().endsWith("@eight.com") ? "ADMIN" : "CUSTOMER";

        User newUser = new User(request.getEmail(), request.getPassword(), role);
        users.put(newUser.getEmail(), newUser);

        response.setSuccess(true);
        response.setMessage("User registered successfully as " + role + ".");
        response.setRole(role);
        return response;
    }

    public AuthResponse login(LoginRequest request) {
        AuthResponse response = new AuthResponse();

        User user = users.get(request.getEmail());
        if (user == null) {
            response.setSuccess(false);
            response.setMessage("User not found.");
            return response;
        }

        if (!user.getPassword().equals(request.getPassword())) {
            response.setSuccess(false);
            response.setMessage("Invalid password.");
            return response;
        }

        response.setSuccess(true);
        response.setMessage("Login successful.");
        response.setRole(user.getRole());
        return response;
    }
}

