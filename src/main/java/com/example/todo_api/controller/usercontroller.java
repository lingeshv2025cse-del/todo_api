package com.example.todo_api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.todo_api.model.usermodel;
import com.example.todo_api.service.userservice;

@RestController
@RequestMapping("/users")
public class usercontroller {
    private final userservice userService;

    public usercontroller(userservice userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public usermodel registerUser(@RequestBody usermodel user) {
        try {
            return userService.registerUser(user);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    @PostMapping("/login")
    public usermodel loginUser(@RequestBody usermodel user) {
        usermodel loggedInUser = userService.loginUser(user.getUsername(), user.getPassword());
        if (loggedInUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }
        return loggedInUser;
    }

    @GetMapping("/count")
    public long countUsers() {
        return userService.countUsers();
    }
}
