package com.example.todo_api.service;
import com.example.todo_api.model.todomodel;
import java.util.List;
import org.springframework.stereotype.Service;


@Service 
public interface todoservice 
{
    public todomodel createTodo(todomodel task);
    public List<todomodel> getAllTodos();

    public todomodel updateTodo(Long id, todomodel task);

    public void deletetodo(Long id);

}
