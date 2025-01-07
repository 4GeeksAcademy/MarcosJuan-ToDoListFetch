import React, { useEffect, useState } from "react";

export const ToDoList = () => {
    const [todos, setTodos] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [editTask, setEditTask] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const host = "https://playground.4geeks.com/todo";
    const user = "MarcosJuan";

    useEffect(() => {
        showTask();
    }, []);

    // Obtener las tareas
    const showTask = async () => {
        const uri = `${host}/users/${user}`;
        const options = {
            method: "GET"
        };

        const response = await fetch(uri, options);
        if (!response.ok) {
            console.error("Error: ", response.status, response.statusText);
            return;
        }

        const data = await response.json();
        setTodos(data.todos);
    };

    // Crear nueva tarea
    const addTask = async (event) => {
        event.preventDefault();
        if (!newTask.trim()) return;

        const dataToSend = {
            label: newTask,
            is_done: false,
        };

        const uri = `${host}/todos/${user}`;
        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSend),
        };

        const response = await fetch(uri, options);
        if (!response.ok) {
            console.error("Error: ", response.status, response.statusText);
            return;
        }

        setNewTask("");
        showTask();
    };

    // Borrar tarea
    const handleDeleteTask = async (taskId) => {
        const uri = `${host}/todos/${taskId}`;
        const options = {
            method: "DELETE"
        };

        const response = await fetch(uri, options);
        if (!response.ok) {
            console.error(
                "Error al eliminar tarea:",
                response.status,
                response.statusText
            );
            return;
        }
        showTask()
        setTodos((prevTodos) => prevTodos.filter((task) => task.id !== taskId));
    };

    // Preparar tarea para edición
    const handleEdit = (task) => {
        setEditTask(task);
        setEditMode(true);
        setNewTask(task.label);
    };

    // Guardar tarea editada
    const saveTask = async (event) => {
        event.preventDefault();
        if (!editTask) return;

        const dataToSend = {
            label: newTask, 
            is_done: isDone
        }

        const uri = `${host}/todos/${editTask.id}`;
        const options = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSend),
        };

        const response = await fetch(uri, options);
        if (!response.ok) {
            console.error(
                "Error al editar la tarea:",
                response.status,
                response.statusText
            );
            return;
        }

        showTask()

        setEditMode(false);
        setEditTask(null);
        setNewTask("");
    };

    return (
        <div className="container">
            <h1 className="text-center mt-4 text-success">ToDo</h1>
            <div className="mb-3">
                <form onSubmit={editMode ? saveTask : addTask}>
                    <input
                        className="form-control"
                        placeholder="Add task"
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                    />
                    {editMode ?
                    <div>
                        <input
                            className="form-check-input mb-2"
                            type="checkbox"
                            checked={isDone}
                            onChange={(e) => setIsDone(e.target.value)}
                        />
                        <label className="form-check-label ms-2">Completed Task</label>
                    </div>
                        : ''}
                    <button type="submit" className="btn btn-primary mt-3">
                        {editMode ? "Save changes" : "Add task"}
                    </button>
                </form>
            </div>
            <h2 className="text-primary text-center">My Todos</h2>
            <div className="list">
                <ul className="list-group">
                    {todos.map((item) => (
                        <li
                            key={item.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            {item.is_done ? "✔️" : "❌"} {item.label}
                            <div>
                            <span onClick={() => handleEdit(item)}>
                                <i className="fas fa-pencil-alt text-success me-3"></i>
                            </span>
                            <span onClick={() => handleDeleteTask(item.id)}>
                                <i className="far fa-trash-alt text-danger"></i>
                            </span>
                            </div>
                        </li>
                    ))}
                    <span className="list-group-item bg-light text-end fw-lighter">
                        {todos.length === 0
                            ? "No tasks, do you want to add?"
                            : `${todos.length} tasks`}
                    </span>
                </ul>
            </div>
        </div>
    );
};

