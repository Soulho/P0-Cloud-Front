import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/TaskForm.css";

const TaskForm = ({ setTasks }) => {
  const [taskData, setTaskData] = useState({
    task: "",
    status: "Sin Empezar",
    category: "",
    date: "",
  });

  const [categories, setCategories] = useState([]); // Lista de categorías disponibles
  const [loading, setLoading] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false); // Mostrar input de nueva categoría
  const [newCategoryName, setNewCategoryName] = useState(""); // Nueva categoría

  const token = localStorage.getItem("token");

  // Obtener ID del usuario desde el token
  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub;
    } catch (error) {
      console.error("Error decodificando el token:", error);
      return null;
    }
  };

  const userId = getUserIdFromToken(token);

  // Obtener categorías del backend
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  // Crear una nueva categoría
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/categories/categories",
        { nombre: newCategoryName, descripcion: "Nueva categoría" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Agregar la nueva categoría a la lista
      setCategories([...categories, response.data]);
      setTaskData((prev) => ({ ...prev, category: response.data.nombre })); // Seleccionar la nueva categoría
      setNewCategoryName(""); // Resetear el input
      setShowNewCategory(false); // Ocultar el input
    } catch (error) {
      console.error("Error creando la categoría:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !userId) {
      console.error("Usuario no autenticado.");
      return;
    }

    // Buscar el ID de la categoría seleccionada
    const selectedCategory = categories.find(cat => cat.nombre === taskData.category);
    const categoryId = selectedCategory ? selectedCategory.id : null;

    if (!categoryId) {
      console.error("Error: Categoría no válida.");
      return;
    }

    const nuevaTarea = {
      texto_tarea: taskData.task,
      estado: taskData.status,
      fecha_creacion: new Date().toISOString().split("T")[0],
      fecha_tentativa_finalizacion: taskData.date || new Date().toISOString().split("T")[0],
      id_usuario: userId,
      id_categoria: categoryId,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/tasks/tareas",
        nuevaTarea,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks((prev) => [...prev, response.data]);

      setTaskData({
        task: "",
        status: "Sin Empezar",
        category: "",
        date: "",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error creando la tarea:", error);
    }
  };

  return (
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
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.nombre}>
                {cat.nombre}
              </option>
            ))}
          </select>

          {/* Botón para agregar nueva categoría */}
          <button type="button" onClick={() => setShowNewCategory(true)}>
            + Nueva Categoría
          </button>
        </div>

        {/* Input para crear nueva categoría */}
        {showNewCategory && (
          <div className="new_category_section">
            <input
              type="text"
              className="new_category_input"
              placeholder="Nombre de la nueva categoría"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <button
              type="button"
              className="new_category_submit"
              onClick={handleCreateCategory}
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear Categoría"}
            </button>
          </div>
        )}

        <div className="task_form_bottom_line">
          {/* Campo de Fecha de Finalización */}
          <input
            type="date"
            name="date"
            value={taskData.date}
            className="task_date"
            onChange={handleChange}
            required
          />

          <select name="status" value={taskData.status} className="task_status" onChange={handleChange}>
            <option value="Sin Empezar">Sin Empezar</option>
            <option value="Empezada">Empezada</option>
            <option value="Finalizada">Finalizada</option>
          </select>

          <button type="submit" className="task_submit" disabled={loading}>
            {loading ? "Creando..." : "+ Agregar Tarea"}
          </button>
        </div>
      </form>
    </header>
  );
};

export default TaskForm;