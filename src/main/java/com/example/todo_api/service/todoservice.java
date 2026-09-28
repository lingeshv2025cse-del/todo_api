package com.example.todo_api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.todo_api.model.todomodel;
import com.example.todo_api.model.usermodel;

@Service 
public interface todoservice 
{
    public todomodel createTodo(todomodel task);
    public List<todomodel> getAllTodos();
    public List<todomodel> getTodosByUser(usermodel user);
    public List<todomodel> reorderTasks(usermodel user, Long draggedId, Long targetId);
    public todomodel updateTodo(Long id, todomodel task);
    public boolean deletetodo(usermodel user, Long id);

}
