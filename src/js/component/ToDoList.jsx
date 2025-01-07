import React, { useEffect, useState } from "react";

export const ToDoList = () => {
    const [ todos, setTodos ] = useState([]);
    const [ newTask, setNewTask ] = useState("");
    const [ editTask, setEditTask ] = useState(null);
    const [ editMode, setEditMode ] = useState(false);
    const host = 'https://playground.4geeks.com/todo'
    const user = 'MarcosJuan'

    useEffect(() => {
        showTask();
    }, []);

    // Obtener las tareas
    const showTask = async () => {
        const uri = `${host}/users/${user}`;
        const options = { 
            method: 'GET'
        };

        const response = await fetch(uri, options);
        if (!response.ok) {
            console.error('Error: ', response.status, response.statusText);
            return;
        }

        const data = await response.json();
        console.log(data)
        setTodos(data.todos); 
    };

    // Crear nueva tarea
    const addTask = async (event) => {
        event.preventDefault();
        const dataToSend = {
            label: newTask,
            is_done: false,
        };

        const uri = `${host}/todos/${user}`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        };

        const response = await fetch(uri, options);
        if (!response.ok) {
            console.error('Error: ', response.status, response.statusText);
            return;
        }

        // Traer devuelta todas las tareas ejecutando la funcion que hace el get
        setNewTask('');
        showTask();
    };

    // Borrar tarea
    const deleteTask = async (taskId) => {
        const uri = `${host}/todos/${user}`;
        const options = { 
            method: "DELETE" 
        };

        const response = await fetch(uri, options);
        if (!response.ok) {
            console.error("Error al eliminar tarea:", response.status, response.statusText);
            return;
        }

        setTodos((prevTodos) => prevTodos.filter((task) => task.id !== taskId));
    };

    // Editar tarea
    const handleEdit = (task) => {
        setEditTask(task);
        setEditMode(true);
        setNewTask(task.label);
    };

    // Guardar tarea editada
    const saveTask = async (event) => {
        event.preventDefault();
        if (!editTask) return;
        const updatedTask = {
            ...editTask,
            label: newTask,
        };

        const uri = `${host}/todos/${user}`;
        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedTask),
        };

        const response = await fetch(uri, options);

        if (!response.ok) {
            console.log("Error al editar la tarea:", response.status, response.statusText);
            return;
        }

        setTodos((prevTodos) =>
            prevTodos.map((task) => (task.id === editTask.id ? updatedTask : task))
        );

        setEditMode(false);
        setEditTask(null);
        setNewTask("");
    };


    return (
        <div>
            <h1>ToDoList</h1>
        </div>
    )
}