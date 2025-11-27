// frontend/src/App.js
import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import { aplicarFondoPorHora, mostrarSaludo } from "./utils/ambientacion";
import "./style.css";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

  // 🌄 Fondo dinámico al cargar la app
  useEffect(() => {
    aplicarFondoPorHora();
  }, []);

  // 🔄 Consulta de usuarios desde backend Express
  useEffect(() => {
    if (usuario) {
      fetch("http://localhost:3001/usuarios")
        .then(res => res.json())
        .then(data => setUsuarios(data))
        .catch(err => console.error("Error al obtener usuarios:", err));
    }
  }, [usuario]);

  // 👋 Saludo emocional al iniciar sesión
  useEffect(() => {
    if (usuario) {
      mostrarSaludo(usuario.displayName || "Explorador");
    }
  }, [usuario]);

  return (
    <div className="container">
      <h1>🌿 Bienvenido a EcoAventuras</h1>

      {!usuario ? (
        mostrarRegistro ? (
          <>
            <SignupForm onSignup={setUsuario} />
            <button className="link-button" onClick={() => setMostrarRegistro(false)}>
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </>
        ) : (
          <>
            <LoginForm onLogin={setUsuario} />
            <button className="link-button" onClick={() => setMostrarRegistro(true)}>
              ¿No tienes cuenta? Regístrate
            </button>
          </>
        )
      ) : (
        <div id="user-panel">
          <h2>{usuario.displayName || "Usuario"}</h2>
          <p>{usuario.email}</p>
          <button onClick={() => setUsuario(null)}>Cerrar sesión</button>

          <h3>👥 Usuarios registrados en Firestore</h3>
          {usuarios.length > 0 ? (
            <ul>
              {usuarios.map(u => (
                <li key={u.id}>{u.nombre} - {u.correo}</li>
              ))}
            </ul>
          ) : (
            <p>No hay usuarios registrados aún.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
