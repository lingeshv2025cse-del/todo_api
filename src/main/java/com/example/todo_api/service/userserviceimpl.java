package com.example.todo_api.service;

import org.springframework.stereotype.Service;

import com.example.todo_api.model.usermodel;
import com.example.todo_api.repo.userrepository;

@Service
public class userserviceimpl implements userservice {
    private final userrepository userRepo;

    public userserviceimpl(userrepository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public usermodel registerUser(usermodel user) {
        if (user == null || user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (userRepo.findByUsername(user.getUsername().trim()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        user.setUsername(user.getUsername().trim());
        return userRepo.save(user);
    }

    @Override
    public usermodel loginUser(String username, String password) {
        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            return null;
        }

        return userRepo.findByUsername(username.trim())
                .filter(user -> user.getPassword().equals(password))
                .orElse(null);
    }

    @Override
    public long countUsers() {
        return userRepo.count();
    }
}
