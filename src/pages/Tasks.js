import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Tasks.css";
import TaskForm from "../components/TaskForm";
import TaskColumn from "../components/TaskColumn";
import todoIcon from "../assets/direct-hit.png";
import doingIcon from "../assets/glowing-star.png";
import doneIcon from "../assets/check-mark-button.png";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  // Obtener el token del usuario autenticado
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("No autorizado. Redirigiendo...");
      setTimeout(() => {
        window.location.href = "/login"; // Redirigir a login si no hay token
      }, 2000);
      return;
    }

    // Obtener el ID del usuario desde el token
    const getUserIdFromToken = (token) => {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar el token
        return payload.sub; // Extraer el "sub" que es el user_id
      } catch (error) {
        console.error("Error decodificando el token:", error);
        return null;
      }
    };

    const userId = getUserIdFromToken(token);
    if (!userId) {
      setError("Token inválido. Redirigiendo...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    // Petición GET al backend para obtener las tareas del usuario autenticado
    axios
      .get(`http://localhost:8000/tasks/usuarios/${userId}/tareas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error obteniendo las tareas:", error);
        setError("Error obteniendo las tareas. Verifica tu sesión.");
      });
  }, [token]);

  const handleDelete = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleEdit = () => {
    // Implementar función de edición
  };

  return (
    <div className="div-tasks">
      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <TaskForm setTasks={setTasks} />
      <div className="tasks_main">
        <TaskColumn
          title="To do"
          icon={todoIcon}
          tasks={tasks}
          status="todo"
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
        <TaskColumn
          title="Doing"
          icon={doingIcon}
          tasks={tasks}
          status="doing"
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
        <TaskColumn
          title="Done"
          icon={doneIcon}
          tasks={tasks}
          status="done"
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      </div>
    </div>
  );
};

export default Tasks;
