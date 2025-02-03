import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [nombre_usuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
  
    const userData = {
      nombre_usuario,
      contrasena,
      imagen_perfil: "default.jpg",
    };
  
    console.log("Enviando usuario:", userData);
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/users/users", userData);
      console.log("Respuesta del backend:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Error en la solicitud:", error.response ? error.response.data : error.message);
      setError("Error al registrarse. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Registrarse</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Usuario"
          value={nombre_usuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
        <button type="submit">Registrarse</button>
      </form>
      <p>
        ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
      </p>
    </div>
  );
}

export default Register;