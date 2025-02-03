import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";

function Login() {
  const [nombre_usuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/users/users/login", {
        nombre_usuario,
        contrasena,
      });
      const token = response.data.access_token;
      localStorage.setItem("token", token);
      
      navigate("/tasks");
    } catch (error) {
      setError("Credenciales incorrectas. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
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
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p>
        ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
      </p>
    </div>
  );
}

export default Login;
