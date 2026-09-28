package com.example.todo_api.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.todo_api.model.todomodel;
import com.example.todo_api.model.usermodel;

public interface todorepository extends JpaRepository<todomodel, Long> 
{
    List<todomodel> findByUser(usermodel user);
    java.util.Optional<todomodel> findByIdAndUser(Long id, usermodel user);
}
