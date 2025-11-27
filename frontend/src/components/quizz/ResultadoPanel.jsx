import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { reproducirSonido } from "../../utils/sonidos";
import "./resultados.css";

export default function ResultadoPanel({ usuario }) {
  const [resultados, setResultados] = useState([]);
  const [estadisticasPorCategoria, setEstadisticasPorCategoria] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerResultados = async () => {
      try {
        const q = query(
          collection(db, "resultadosQuizz"),
          where("usuarioId", "==", usuario.uid || usuario.id)
        );
        const snapshot = await getDocs(q);
        const datos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setResultados(datos);
        calcularEstadisticas(datos);
      } catch (error) {
        console.error("Error al obtener resultados:", error);
        alert("❌ No se pudieron cargar los resultados");
      }
    };

    obtenerResultados();
  }, [usuario]);

  const formatearFecha = (fechaRaw) => {
    const fecha = fechaRaw?.toDate?.() || new Date(fechaRaw);
    return fecha instanceof Date && !isNaN(fecha)
      ? fecha.toLocaleDateString("es-ES")
      : "Fecha inválida";
  };

  const volverAlExplorador = () => {
    reproducirSonido("/sonidos/efectos/seleccion.mp3");
    navigate("/explorador");
  };

  // Agrupar resultados por cuestionario
  const resultadosPorCuestionario = resultados.reduce((acc, r) => {
    const clave = r.cuestionarioId || "sin-id";
    if (!acc[clave]) {
      acc[clave] = {
        nombre: r.cuestionarioNombre || "Cuestionario desconocido",
        items: []
      };
    }
    acc[clave].items.push(r);
    return acc;
  }, {});

  // Calcular estadísticas por categoría
  const calcularEstadisticas = async (resultados) => {
    const cuestionariosSnapshot = await getDocs(collection(db, "cuestionarios"));
    const cuestionarios = cuestionariosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const stats = {};

    resultados.forEach(r => {
      const cuestionario = cuestionarios.find(c => c.id === r.cuestionarioId);
      const categoria = cuestionario?.categoria || "Sin categoría";

      if (!stats[categoria]) {
        stats[categoria] = {
          total: 0,
          correctas: 0,
          incorrectas: 0
        };
      }

      stats[categoria].total += 1;
      stats[categoria].correctas += r.correctas;
      stats[categoria].incorrectas += r.incorrectas;
    });

    setEstadisticasPorCategoria(stats);
  };

  return (
    <div className="resultados-panel">
      <h2>📊 Historial de quizz por cuestionario</h2>

      {resultados.length === 0 ? (
        <p>No hay resultados registrados.</p>
      ) : (
        Object.entries(resultadosPorCuestionario).map(([id, grupo]) => (
          <div key={id} className="bloque-cuestionario">
            <h3>📘 {grupo.nombre}</h3>
            <ul>
              {grupo.items.map((r, i) => (
                <li key={i}>
                  <strong>{formatearFecha(r.fecha)}</strong> — ✅ {r.correctas} / ❌ {r.incorrectas}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      <h2 style={{ marginTop: "2rem" }}>📈 Estadísticas por categoría</h2>
      {Object.keys(estadisticasPorCategoria).length === 0 ? (
        <p>No hay datos suficientes para mostrar estadísticas.</p>
      ) : (
        <ul className="estadisticas-categorias">
          {Object.entries(estadisticasPorCategoria).map(([categoria, datos]) => (
            <li key={categoria}>
              <strong>{categoria}</strong> — 🧪 Quizz realizados: {datos.total}, ✅ Promedio correctas: {(datos.correctas / datos.total).toFixed(1)}, ❌ Promedio incorrectas: {(datos.incorrectas / datos.total).toFixed(1)}
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <button className="finalizar-btn" onClick={volverAlExplorador}>
          🔙 Volver al panel de explorador
        </button>
      </div>
    </div>
  );
}
