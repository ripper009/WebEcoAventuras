import "./explorador.css";
import { useNavigate } from "react-router-dom";
import { reproducirSonido } from "../../utils/sonidos";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export default function ExploradorPanel({ usuario, onLogout }) {
  const hora = new Date().getHours();
  const saludoBase =
    hora < 12 ? "🌞 Buenos días" : hora < 18 ? "🌅 Buenas tardes" : "🌙 Buenas noches";
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    reproducirSonido("/sonidos/efectos/seleccion.mp3");
    try {
      await signOut(auth); // cerrar sesión en Firebase
    } catch (err) {
      console.error("Error al cerrar sesión en Firebase:", err);
    }
    if (typeof onLogout === "function") {
      onLogout();
    } else {
      navigate("/"); // fallback
    }
  };

  return (
    <div className="explorador-panel">
      <header className="explorador-header">
        <h2>{saludoBase}, {usuario.displayName}</h2>
        <p>🌿 Prepárate para tu próxima aventura ambiental.</p>
      </header>

      <section className="explorador-opciones">
        <button type="button" className="opcion-btn" onClick={() => navigate("/quizz")}>
          🧠 Realizar quizz
        </button>

        <button type="button" className="opcion-btn" onClick={() => navigate("/resultados")}>
          📊 Ver historial
        </button>

        <button type="button" className="opcion-btn" onClick={() => navigate("/podio")}>
          🏆 Ver podio de exploradores
        </button>
        <button type="button" className="opcion-btn" onClick={() => navigate("/clima")}>
          🌍 Aprender sobre Cambio Climático
        </button>
        <button type="button" className="opcion-btn" onClick={cerrarSesion}>
          🚪 Cerrar sesión
        </button>

        
      </section>
    </div>
  );
}
