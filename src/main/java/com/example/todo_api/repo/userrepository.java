package com.example.todo_api.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.todo_api.model.usermodel;

public interface userrepository extends JpaRepository<usermodel, Long> {
    Optional<usermodel> findByUsername(String username);
}
