package com.example.todo_api.service;

import org.springframework.stereotype.Service;
import com.example.todo_api.model.todomodel;
import com.example.todo_api.repo.todorepository;
import java.util.List;
@Service 

public class todoserviceimpl implements todoservice 
{
    private todorepository todorepo;

    public todoserviceimpl(todorepository todorepo) {
        this.todorepo = todorepo;
    }

    @Override 
    public todomodel createTodo(todomodel task) {
        return todorepo.save(task);
    }
    public List<todomodel> getAllTodos() {
        return todorepo.findAll();
    }

    public todomodel updateTodo(Long id, todomodel task) {
        todomodel extodo = todorepo.findById(id).orElse(null);
        if(extodo == null) {
            return null; 
        }
        extodo.setTask(task.getTask());
        return todorepo.save(extodo);
    }

    public void deletetodo(Long id)
    {
        todorepo.deleteById(id);
    }


}
