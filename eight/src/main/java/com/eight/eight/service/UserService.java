package com.eight.eight.service;

import com.eight.eight.model.*;
import com.eight.eight.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public AuthResponse register(RegisterRequest request) {
        AuthResponse response = new AuthResponse();

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            response.setSuccess(false);
            response.setMessage("Passwords do not match.");
            return response;
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            response.setSuccess(false);
            response.setMessage("User already exists.");
            return response;
        }

        String role = request.getEmail().endsWith("@eight.com") ? "ADMIN" : "CUSTOMER";
        User newUser = new User(null, request.getEmail(), request.getPassword(), role);
        userRepository.save(newUser);

        response.setSuccess(true);
        response.setMessage("User registered successfully as " + role + ".");
        response.setRole(role);
        return response;
    }

    public AuthResponse login(LoginRequest request) {
        AuthResponse response = new AuthResponse();
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            response.setSuccess(false);
            response.setMessage("User not found.");
            return response;
        }

        User user = userOptional.get();
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
