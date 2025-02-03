import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Tasks.css";
import TaskForm from "../components/TaskForm";
import TaskColumn from "../components/TaskColumn";
import TaskEdit from "../components/TaskEdit";
import todoIcon from "../assets/direct-hit.png";
import doingIcon from "../assets/glowing-star.png";
import doneIcon from "../assets/check-mark-button.png";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  // Obtener el token del usuario autenticado
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
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
      .get(`http://127.0.0.1:8000/tasks/usuarios/${userId}/tareas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Ajustar la estructura de las tareas al formato necesario
        const formattedTasks = response.data.map((task) => ({
          id: task.id,
          task: task.texto_tarea, // Cambia "texto_tarea" a "task"
          fechaIni: task.fecha_creacion,
          status: task.estado, // Convertir estado a formato correcto
          category: task.categoria.nombre,
          fechaFin: task.fecha_tentativa_finalizacion // Extraer nombre de la categoría
        }));

        setTasks(formattedTasks);
      })
      .catch((error) => {
        console.error("Error obteniendo las tareas:", error);
        setError("Error obteniendo las tareas. Verifica tu sesión.");
      });
  }, [token]);

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/tasks/tareas/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task.id !== taskId)); // Actualizar el estado después de eliminar
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleEdit = (task) => {
    console.log("Editando tarea:", task);
    setEditingTask(task);
  };

  return (
    <div className="div-tasks">
      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      {editingTask && (
          <TaskEdit
              task={editingTask}
              setTasks={setTasks}
              closeModal={() => setEditingTask(null)}
          />
      )}

      {error && <p className="error-message">{error}</p>}

      <TaskForm setTasks={setTasks} />
      <div className="tasks_main">
        <TaskColumn
          title="Sin Empezar"
          icon={todoIcon}
          tasks={tasks}
          status="Sin Empezar"
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
        <TaskColumn
          title="Empezada"
          icon={doingIcon}
          tasks={tasks}
          status="Empezada"
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
        <TaskColumn
          title="Finalizada"
          icon={doneIcon}
          tasks={tasks}
          status="Finalizada"
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      </div>
    </div>
  );
};

export default Tasks;
