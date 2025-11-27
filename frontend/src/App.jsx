import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import AdminPanel from "./components/panels/AdminPanel";
import ExploradorPanel from "./components/panels/ExploradorPanel";
import SaludoPanel from "./components/panels/SaludoPanel";
import Quizz from "./components/quizz/Quizz";
import ResultadoPanel from "./components/quizz/ResultadoPanel";
import { aplicarFondoPorHora } from "./utils/ambientacion";
import { saludarConVoz } from "./utils/saludoVoz";
import "./style.css";
import Podium from "./components/quizz/Podium";
import Tutoriales from "./components/tutoriales/Tutoriales";
import CambioClimatico from "./components/clima/CambioClimatico";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [yaSaludo, setYaSaludo] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    aplicarFondoPorHora();
  }, []);

  // ✅ Evita el loop: solo saluda y navega a /saludo una vez
  useEffect(() => {
    if (usuario && !yaSaludo && location.pathname === "/") {
      saludarConVoz(usuario.displayName || "Explorador");
      navigate("/saludo");
      setYaSaludo(true);
    }
  }, [usuario, yaSaludo, location, navigate]);

  useEffect(() => {
    if (usuario?.rol === "admin") {
      (async () => {
        try {
          const res = await fetch("http://localhost:3001/usuarios");
          const data = await res.json();
          setUsuarios(data);
        } catch (err) {
          console.error("Error al obtener usuarios:", err);
        }
      })();
    }
  }, [usuario?.rol]);

  const continuarAlPanel = () => {
    navigate(usuario?.rol === "admin" ? "/admin" : "/explorador");
  };

  const cerrarSesion = () => {
    setUsuario(null);
    setUsuarios([]);
    setYaSaludo(false); // ✅ resetear para próxima sesión
    navigate("/");
  };

  return (
    <Routes>
      {/* Página principal: login o registro */}
      <Route path="/" element={
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
            <Navigate to="/saludo" />
          )}
        </div>
      } />

      {/* Saludo personalizado */}
      <Route path="/saludo" element={
        usuario ? (
          <SaludoPanel
            usuario={usuario}
            onLogout={cerrarSesion}
            onContinuar={continuarAlPanel}
          />
        ) : (
          <Navigate to="/" />
        )
      } />

      {/* Panel de administración */}
      <Route path="/admin" element={
        usuario?.rol === "admin" ? (
          <AdminPanel usuario={usuario} usuarios={usuarios} />
        ) : (
          <Navigate to="/" />
        )
      } />

      {/* Panel de explorador */}
      <Route path="/explorador" element={
        usuario?.rol === "explorador" ? (
          <ExploradorPanel usuario={usuario} onLogout={cerrarSesion} />
        ) : (
          <Navigate to="/" />
        )
      } />

      {/* Quizz ambiental */}
      <Route path="/quizz" element={
        usuario?.rol === "explorador" ? (
          <Quizz usuario={usuario} />
        ) : (
          <Navigate to="/" />
        )
      } />

      {/* Resultados del quizz */}
      <Route path="/resultados" element={
        usuario?.rol === "explorador" ? (
          <ResultadoPanel usuario={usuario} />
        ) : (
          <Navigate to="/" />
        )
      } />

      {/* Podio */}
      <Route path="/podio" element={
        usuario?.rol === "explorador" ? (
          <Podium onLogout={cerrarSesion} />
        ) : (
          <Navigate to="/" />
        )
      } />

      {/* Tutoriales */}
      <Route path="/tutoriales" element={
        usuario ? (
          <Tutoriales />
        ) : (
          <Navigate to="/" />
        )
      } />

      {/* Cambio Climático */}
      <Route path="/clima" element={
        usuario ? (
          <CambioClimatico usuario={usuario} />
        ) : (
          <Navigate to="/" />
        )
      } />
    </Routes>
  );
}

export default App;
