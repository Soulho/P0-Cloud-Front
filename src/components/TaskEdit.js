import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/TaskForm.css";

const TaskEdit = ({ task, setTasks, closeModal }) => {
  const [taskData, setTaskData] = useState({
    task: "",
    status: "Sin Empezar",
    category: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [categories, setCategories] = useState([]);

  // Obtener categorías disponibles del backend
  useEffect(() => {
    if (!token) return;

    axios
      .get("http://127.0.0.1:8000/categories/categories", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error obteniendo categorías:", error);
      });
  }, [token]);

  // Cargar datos de la tarea en el formulario
  useEffect(() => {
    if (task) {
      setTaskData({
        task: task.task || "",
        status: task.status || "Sin Empezar",
        category: task.category || "",
        date: task.fechaFin || "",
        fecha_creacion: task.fechaIni || "",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!task || !task.id) {
      console.error("Error: No se puede actualizar una tarea sin ID.");
      return;
    }

    setLoading(true);

    // Obtener el userId desde el token
    const token = localStorage.getItem("token");
    const getUserIdFromToken = (token) => {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar JWT
        return payload.sub; // Extraer el "sub" que es el user_id
      } catch (error) {
        console.error("Error decodificando el token:", error);
        return null;
      }
    };

    const userId = getUserIdFromToken(token);

    // Construir el objeto de la tarea con la estructura correcta
    const updatedTask = {
      texto_tarea: taskData.task,
      fecha_creacion: taskData.fecha_creacion,
      fecha_tentativa_finalizacion: taskData.date,
      estado: taskData.status,
      id_usuario: userId, // Obtener el user_id desde el token
      id_categoria: categories.find(cat => cat.nombre === taskData.category)?.id || task.id_categoria
    };

    console.log("Enviando tarea actualizada:", updatedTask);

    try {
      await axios.put(
        `http://127.0.0.1:8000/tasks/tareas/${task.id}`,
        updatedTask,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? { ...t, ...updatedTask } : t))
      );

      closeModal();
      window.location.reload();
    } catch (error) {
      console.error("Error actualizando la tarea:", error.response ? error.response.data : error);
    } finally {
      setLoading(false);
    }
};

  return (
    <div className="modal-background">
      <div className="modal-content">
        <header className="app_header">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="task"
              value={taskData.task}
              className="task_input"
              placeholder="Escribe tu tarea"
              onChange={handleChange}
              required
            />

            <div className="task_form_bottom_line">
              {/* Selector de Categoría */}
              <select
                name="category"
                value={taskData.category}
                className="task_category"
                onChange={handleChange}
                required
              >
                <option value="">Selecciona o escribe una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.nombre}>
                    {cat.nombre}
                  </option>
                ))}
              </select>

              {/* Campo de Fecha de Finalización */}
              <input
                type="date"
                name="date"
                value={taskData.date}
                className="task_date"
                onChange={handleChange}
                required
              />

              <select
                name="status"
                value={taskData.status}
                className="task_status"
                onChange={handleChange}
              >
                <option value="Sin Empezar">Sin Empezar</option>
                <option value="Empezada">Empezada</option>
                <option value="Finalizada">Finalizada</option>
              </select>

              <button type="submit" className="task_submit" disabled={loading}>
                {loading ? "Actualizando..." : "Actualizar Tarea"}
              </button>
            </div>
          </form>
          <button className="close-button" onClick={closeModal}>
            X
          </button>
        </header>
      </div>
    </div>
  );
};

export default TaskEdit;