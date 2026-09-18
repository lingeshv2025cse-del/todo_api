package com.example.todo_api.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.todo_api.model.todomodel;

public interface todorepository extends JpaRepository<todomodel, Long> 
{

}
