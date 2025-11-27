import { useNavigate } from "react-router-dom";

export default function SaludoPanel({ usuario, onLogout, onContinuar }) {
  const navigate = useNavigate(); // 👈 aquí

  const hora = new Date().getHours();
  const saludoBase = hora < 12 ? "🌞 Buenos días" : hora < 18 ? "🌅 Buenas tardes" : "🌙 Buenas noches";

  return (
    <div className="saludo-panel">
      <h3>{saludoBase}, {usuario.displayName}</h3>
      <p>{usuario.email}</p>
      <p>Rol: {usuario.rol}</p>
      <div className="botones-saludo">
        <button onClick={onLogout}>🔓 Cerrar sesión</button>
        <button onClick={onContinuar}>🚀 Continuar</button>
        <button type="button" onClick={() => navigate("/tutoriales")}> 🎬 Ir a Tutoriales</button>
      </div>
    </div>
  );
}
