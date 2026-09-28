package com.example.todo_api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.todo_api.model.todomodel;
import com.example.todo_api.model.usermodel;
import com.example.todo_api.repo.todorepository;

@Service 

public class todoserviceimpl implements todoservice 
{
    private todorepository todorepo;

    public todoserviceimpl(todorepository todorepo) {
        this.todorepo = todorepo;
    }

    @Override 
    public todomodel createTodo(todomodel task) {
        if (task.getUser() != null) {
            task.setUsername(task.getUser().getUsername());
            task.setPassword(task.getUser().getPassword());
        }
        return todorepo.save(task);
    }

    public List<todomodel> getAllTodos() {
        return todorepo.findAll();
    }

    public List<todomodel> getTodosByUser(usermodel user) {
        List<todomodel> tasks = todorepo.findByUser(user);
        tasks.sort((a, b) -> Integer.compare(a.getOrderIndex(), b.getOrderIndex()));
        return tasks;
    }

    public List<todomodel> reorderTasks(usermodel user, Long draggedId, Long targetId) {
        List<todomodel> tasks = todorepo.findByUser(user);
        tasks.sort((a, b) -> Integer.compare(a.getOrderIndex(), b.getOrderIndex()));

        todomodel dragged = tasks.stream().filter(task -> task.getId().equals(draggedId)).findFirst().orElse(null);
        todomodel target = tasks.stream().filter(task -> task.getId().equals(targetId)).findFirst().orElse(null);

        if (dragged == null || target == null || dragged.equals(target)) {
            return tasks;
        }

        tasks.remove(dragged);
        int targetIndex = tasks.indexOf(target);
        tasks.add(targetIndex, dragged);

        for (int i = 0; i < tasks.size(); i++) {
            tasks.get(i).setOrderIndex(i);
        }

        todorepo.saveAll(tasks);
        return tasks;
    }

    public todomodel updateTodo(Long id, todomodel task) {
        todomodel extodo = todorepo.findById(id).orElse(null);
        if(extodo == null) {
            return null; 
        }

        if (task.getTask() != null) {
            extodo.setTask(task.getTask());
        }
        if (task.getDueDate() != null) {
            extodo.setDueDate(task.getDueDate());
        }
        if (task.getPriority() != null) {
            extodo.setPriority(task.getPriority());
        }
        if (task.getUser() != null) {
            extodo.setUser(task.getUser());
            extodo.setUsername(task.getUser().getUsername());
            extodo.setPassword(task.getUser().getPassword());
        }
        extodo.setCompleted(task.isCompleted());
        return todorepo.save(extodo);
    }

    public boolean deletetodo(usermodel user, Long id)
    {
        todomodel task = todorepo.findByIdAndUser(id, user).orElse(null);
        if (task == null) {
            return false;
        }
        todorepo.delete(task);
        return true;
    }


}
