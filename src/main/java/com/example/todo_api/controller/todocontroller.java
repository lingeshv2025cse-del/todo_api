package com.example.todo_api.controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.todo_api.model.todomodel;
import com.example.todo_api.service.todoservice;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;





@RestController 
// http://localhost:8080/todos
@RequestMapping ("/todos")
public class todocontroller 
{
    private  todoservice todoSer;


    public todocontroller(todoservice todoSer) 
    {
        this.todoSer = todoSer;
    }

    // http://localhost:8080/todos/createTodo
    @PostMapping("/createTodo")
    
    public todomodel createTodo(@RequestBody todomodel task) {
        return todoSer.createTodo(task);
    }
    
    @GetMapping("/getTodo")

    public List<todomodel> getAllTodos() {
        return todoSer.getAllTodos();
    }

    @PutMapping("/updateTodo/{id}")
    public todomodel updatetodo(@PathVariable Long id,@RequestBody todomodel task) {
        return todoSer.updateTodo(id, task);
    }
    
    @DeleteMapping ("/deleteTodo/{id}")
    public String deletetodo(@PathVariable Long id)
    {
        todoSer.deletetodo(id);
        return "ur task has been deleted successfully";
    }

}
