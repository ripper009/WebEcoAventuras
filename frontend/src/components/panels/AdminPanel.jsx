import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PreguntasPanel from "../admin/PreguntasPanel";
import "./admin.css"; // ✅ estilos aislados solo para este panel
import EstadisticasPanel from "../admin/EstadisticasPanel";


export default function AdminPanel({ usuario }) {
  const [usuarios, setUsuarios] = useState([]);
  const [vista, setVista] = useState("usuarios");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/usuarios")
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error("Error al obtener usuarios:", err));
  }, []);

  const actualizarUsuario = async (id, cambios) => {
    try {
      await fetch(`http://localhost:3001/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cambios)
      });
      alert("✅ Usuario actualizado");
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
    }
  };

  const eliminarUsuario = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (!confirmar) return;

    try {
      await fetch(`http://localhost:3001/usuarios/${id}`, { method: "DELETE" });
      alert("🗑️ Usuario eliminado");
      setUsuarios(usuarios.filter(u => u.id !== id));
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
    }
  };

  const cerrarSesion = () => {
    // Limpieza opcional de datos de sesión
    localStorage.removeItem("usuario");
    navigate("/"); // Redirige al login
  };

  return (
    <div className="eco-admin">
      <h2>🛠 Panel de administración</h2>
      <button className="cerrar-sesion-btn" onClick={cerrarSesion}>
        🔓 Cerrar sesión
      </button>

      <nav className="admin-nav">
        <button
          className={vista === "usuarios" ? "active" : ""}
          onClick={() => setVista("usuarios")}
        >
          👥 Usuarios
        </button>
        <button
          className={vista === "preguntas" ? "active" : ""}
          onClick={() => setVista("preguntas")}
        >
          🧠 Preguntas del quizz
        </button>

        <button
  className={vista === "estadisticas" ? "active" : ""}
  onClick={() => setVista("estadisticas")}
>
  📊 Estadísticas
</button>

      </nav>

      <div className="admin-content">
        {vista === "usuarios" && (
          <section className="usuarios-section">
            <h3>👥 Gestión de usuarios</h3>
            {usuarios.length === 0 ? (
              <p>No hay usuarios registrados.</p>
            ) : (
              usuarios.map(u => {
                const copiaUsuario = { ...u };
                return (
                  <div key={u.id} className="usuario-card">
                    <input
                      defaultValue={u.nombre}
                      onBlur={e => (copiaUsuario.nombre = e.target.value)}
                    />
                    <input
                      defaultValue={u.correo}
                      onBlur={e => (copiaUsuario.correo = e.target.value)}
                    />
                    <select
                      defaultValue={u.rol}
                      onChange={e => (copiaUsuario.rol = e.target.value)}
                    >
                      <option value="admin">Admin</option>
                      <option value="explorador">Explorador</option>
                    </select>
                    <div className="acciones">
                      <button onClick={() => actualizarUsuario(u.id, copiaUsuario)}>💾 Guardar</button>
                      <button className="danger" onClick={() => eliminarUsuario(u.id)}>🗑️ Eliminar</button>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        )}

        {vista === "preguntas" && (
          <section className="preguntas-section">
            <button className="volver-btn" onClick={() => setVista("usuarios")}>
              🔙 Volver
            </button>
            <PreguntasPanel />
          </section>
        )}

        {vista === "estadisticas" && (
  <section className="estadisticas-section">
    <button className="volver-btn" onClick={() => setVista("usuarios")}>
      🔙 Volver
    </button>
    <EstadisticasPanel />
  </section>
)}

      </div>
    </div>
  );
}
