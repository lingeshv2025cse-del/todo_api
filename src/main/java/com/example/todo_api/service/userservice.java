package com.example.todo_api.service;

import com.example.todo_api.model.usermodel;

public interface userservice {
    usermodel registerUser(usermodel user);
    usermodel loginUser(String username, String password);
    long countUsers();
}
