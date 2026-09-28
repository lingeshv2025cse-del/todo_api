package com.example.todo_api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.todo_api.model.todomodel;

@SpringBootTest
class TodoApiApplicationTests {

	@Test
	void taskSupportsDueDatePriorityCompletionAndOrderState() {
		todomodel task = new todomodel();
		task.setTask("Submit project");
		task.setDueDate(LocalDate.of(2026, 9, 30));
		task.setPriority("HIGH");
		task.setCompleted(false);
		task.setOrderIndex(2);

		assertEquals("Submit project", task.getTask());
		assertEquals(LocalDate.of(2026, 9, 30), task.getDueDate());
		assertEquals("HIGH", task.getPriority());
		assertFalse(task.isCompleted());
		assertEquals(2, task.getOrderIndex());

		task.setCompleted(true);
		assertTrue(task.isCompleted());
	}

	@Test
	void dashboardStylesStillContainTaskLayoutClasses() throws Exception {
		String css = Files.readString(Path.of("src/main/resources/static/index.css"));

		assertTrue(css.contains(".todo-form"));
		assertTrue(css.contains(".todo-item"));
		assertTrue(css.contains(".todo-section"));
	}

}
