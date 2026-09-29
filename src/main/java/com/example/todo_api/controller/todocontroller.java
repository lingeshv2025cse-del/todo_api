package com.example.todo_api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.example.todo_api.model.todomodel;
import com.example.todo_api.model.usermodel;
import com.example.todo_api.repo.userrepository;
import com.example.todo_api.service.todoservice;

@RestController 
@RequestMapping ("/todos")
public class todocontroller 
{
    private final todoservice todoSer;
    private final userrepository userRepo;

    public todocontroller(todoservice todoSer, userrepository userRepo) 
    {
        this.todoSer = todoSer;
        this.userRepo = userRepo;
    }

    @PostMapping("/createTodo")
    public todomodel createTodo(@RequestParam Long userId, @RequestBody todomodel task) {
        usermodel user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        task.setUser(user);
        return todoSer.createTodo(task);
    }
    
    @GetMapping("/getTodo")
    public List<todomodel> getAllTodos(@RequestParam Long userId) {
        usermodel user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return todoSer.getTodosByUser(user);
    }

    @PutMapping("/reorderTodo")
    public List<todomodel> reorderTodo(@RequestParam Long userId, @RequestParam Long draggedId, @RequestParam Long targetId) {
        usermodel user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return todoSer.reorderTasks(user, draggedId, targetId);
    }

    @PutMapping("/updateTodo/{id}")
    public todomodel updatetodo(@PathVariable Long id,@RequestBody todomodel task) {
        todomodel updatedTask = todoSer.updateTodo(id, task);
        if (updatedTask == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found");
        }
        return updatedTask;
    }
    
    @DeleteMapping ("/deleteTodo/{id}")
    public String deletetodo(@PathVariable Long id, @RequestParam Long userId)
    {
        usermodel user = userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        if (!todoSer.deletetodo(user, id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found");
        }
        return "Task deleted successfully";
    }

}
