import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { reproducirSonido } from "../../utils/sonidos";
import "./podium.css";

export default function Podium({ onLogout }) {
  const [ranking, setRanking] = useState([]);
  const [cuestionarios, setCuestionarios] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const resultadosSnap = await getDocs(collection(db, "resultadosQuizz"));
        const cuestionariosSnap = await getDocs(collection(db, "cuestionarios"));

        const resultados = resultadosSnap.docs.map(doc => doc.data());
        const cuestionarios = cuestionariosSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCuestionarios(cuestionarios);

        const enriquecidos = resultados
          .filter(r => r.correctas !== undefined && r.duracion !== undefined)
          .map(r => {
            const cuestionario = cuestionarios.find(c => c.id === r.cuestionarioId);
            return {
              ...r,
              cuestionarioNombre: r.cuestionarioNombre || cuestionario?.nombre || "Cuestionario desconocido",
              categoria: cuestionario?.categoria || "Sin categoría"
            };
          });

        setRanking(enriquecidos);
      } catch (error) {
        console.error("Error al obtener ranking:", error);
        alert("❌ No se pudo cargar el podio");
      }
    };

    obtenerDatos();
  }, []);

  const volver = () => {
    reproducirSonido("/sonidos/efectos/seleccion.mp3");
    navigate("/explorador");
  };

  const cerrarSesion = () => {
    reproducirSonido("/sonidos/efectos/seleccion.mp3");
    if (typeof onLogout === "function") {
      onLogout();
    } else {
      navigate("/");
    }
  };

  const medalla = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return "🏅";
  };

  const insignia = (correctas) => {
    if (correctas >= 10) return "🌟 Leyenda Verde";
    if (correctas >= 7) return "🍃 Guardián del Bosque";
    if (correctas >= 4) return "🌱 Explorador en Ascenso";
    return "🪵 Aprendiz Ambiental";
  };

  const categoriasDisponibles = [
    "Todas",
    ...Array.from(new Set(cuestionarios.map(c => c.categoria || "Sin categoría")))
  ];

  const rankingFiltrado = ranking
    .filter(r => categoriaSeleccionada === "Todas" || r.categoria === categoriaSeleccionada)
    .sort((a, b) => {
      if (b.correctas !== a.correctas) return b.correctas - a.correctas;
      return a.duracion - b.duracion;
    })
    .slice(0, 10);

  return (
    <div className="podium-panel">
      <h2>🏆 Podio de exploradores</h2>
      <p>🌲 Los mejores resultados por precisión y velocidad</p>

      <div className="filtro-categoria">
        <label htmlFor="categoria">Filtrar por categoría:</label>
        <select
          id="categoria"
          value={categoriaSeleccionada}
          onChange={e => setCategoriaSeleccionada(e.target.value)}
        >
          {categoriasDisponibles.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <ul className="ranking-lista">
        {rankingFiltrado.length === 0 ? (
          <p>❌ No hay resultados en esta categoría.</p>
        ) : (
          rankingFiltrado.map((r, i) => (
            <li key={i} className="ranking-item">
              <span className="medalla">{medalla(i)}</span>
              <div className="info">
                <strong>{r.nombre || "Explorador"}</strong>
                <p>✅ {r.correctas} / ⏱️ {r.duracion}s</p>
                <p>📘 {r.cuestionarioNombre} — 🗂️ {r.categoria}</p>
                <span className="insignia">{insignia(r.correctas)}</span>
              </div>
            </li>
          ))
        )}
      </ul>

      <div className="botones-podio">
        <button onClick={volver}>🔙 Volver</button>
        <button onClick={cerrarSesion}>🚪 Cerrar sesión</button>
      </div>
    </div>
  );
}
