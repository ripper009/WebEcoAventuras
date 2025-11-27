import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { reproducirSonido } from "../../utils/sonidos";
import GraficoModal from "./GraficoModal";
import GraficoComparativo from "./GraficoComparativo";
import "./estadisticas.css";

export default function EstadisticasPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [cuestionarios, setCuestionarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mostrarGrafico, setMostrarGrafico] = useState(false);
  const [estadisticasPorCategoria, setEstadisticasPorCategoria] = useState({});
  const [mostrarComparativo, setMostrarComparativo] = useState(false);
  const [usuariosConResultados, setUsuariosConResultados] = useState([]);


  useEffect(() => {
    const obtenerUsuarios = async () => {
      const snapshot = await getDocs(collection(db, "usuarios"));
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsuarios(lista);
    };

    const obtenerCuestionarios = async () => {
      const snapshot = await getDocs(collection(db, "cuestionarios"));
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCuestionarios(lista);
    };

    obtenerUsuarios();
    obtenerCuestionarios();
  }, []);

  const seleccionarUsuario = async () => {
    reproducirSonido("/sonidos/efectos/seleccion.mp3");
    const encontrado = usuarios.find(u => u.nombre.toLowerCase() === busqueda.toLowerCase());
    if (encontrado) {
      const q = query(
        collection(db, "resultadosQuizz"),
        where("usuarioId", "==", encontrado.id || encontrado.uid)
      );
      const snapshot = await getDocs(q);
      const resultados = snapshot.docs.map(doc => doc.data());

      const enriquecidos = resultados.map(r => {
        const cuestionario = cuestionarios.find(c => c.id === r.cuestionarioId);
        return {
          ...r,
          cuestionarioNombre: r.cuestionarioNombre || cuestionario?.nombre || "Cuestionario desconocido",
          categoria: cuestionario?.categoria || "Sin categoría"
        };
      });

      calcularEstadisticasPorCategoria(enriquecidos);
      setUsuarioSeleccionado({ ...encontrado, resultados: enriquecidos });
    } else {
      setUsuarioSeleccionado(null);
      setEstadisticasPorCategoria({});
    }
  };

  const calcularEstadisticasPorCategoria = (resultados) => {
    const stats = {};
    resultados.forEach(r => {
      const cat = r.categoria || "Sin categoría";
      if (!stats[cat]) {
        stats[cat] = { total: 0, correctas: 0, incorrectas: 0 };
      }
      stats[cat].total += 1;
      stats[cat].correctas += r.correctas;
      stats[cat].incorrectas += r.incorrectas;
    });
    setEstadisticasPorCategoria(stats);
  };

  const cargarResultadosDeTodos = async () => {
  reproducirSonido("/sonidos/efectos/seleccion.mp3");

  const resultadosSnap = await getDocs(collection(db, "resultadosQuizz"));
  const resultados = resultadosSnap.docs.map(doc => doc.data());

  const enriquecidos = usuarios.map(u => {
    const resultadosUsuario = resultados
      .filter(r => r.usuarioId === u.id || r.usuarioId === u.uid)
      .map(r => {
        const cuestionario = cuestionarios.find(c => c.id === r.cuestionarioId);
        return {
          ...r,
          cuestionarioNombre: r.cuestionarioNombre || cuestionario?.nombre || "Cuestionario desconocido",
          categoria: cuestionario?.categoria || "Sin categoría"
        };
      });

    return {
      ...u,
      resultados: resultadosUsuario
    };
  }).filter(u => u.resultados.length > 0);

  setUsuariosConResultados(enriquecidos);
  setMostrarComparativo(true);
};


  return (
    <div className="eco-estadisticas">
      <h2>📊 Estadísticas de exploradores</h2>
      <input
        type="text"
        placeholder="🔍 Buscar por nombre..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        onBlur={seleccionarUsuario}
      />

      <div className="contenido-scroll">
        {usuarioSeleccionado ? (
          <div className="usuario-estadisticas">
            <h3>🌿 {usuarioSeleccionado.nombre}</h3>
            <p>Correo: {usuarioSeleccionado.correo}</p>
            <p>Quizzes completados: {usuarioSeleccionado.resultados.length}</p>
            <p>
              Puntaje promedio:{" "}
              {(
                usuarioSeleccionado.resultados.reduce((acc, r) => acc + r.correctas, 0) /
                usuarioSeleccionado.resultados.length
              ).toFixed(2)}
            </p>

            <h4>📂 Rendimiento por categoría</h4>
            <ul className="estadisticas-categorias">
              {Object.entries(estadisticasPorCategoria).map(([cat, datos]) => (
                <li key={cat}>
                  <strong>{cat}</strong> — 🧪 Quizz: {datos.total}, ✅ Promedio correctas: {(datos.correctas / datos.total).toFixed(1)}, ❌ Promedio incorrectas: {(datos.incorrectas / datos.total).toFixed(1)}
                </li>
              ))}
            </ul>

            <button onClick={() => { reproducirSonido("/sonidos/efectos/seleccion.mp3"); setMostrarGrafico(true); }}>
              📈 Ver gráfica
            </button>
            <button onClick={cargarResultadosDeTodos}>
  🧮 Comparar exploradores
</button>

          </div>
        ) : (
          <p>🧭 Escribe un nombre válido para ver estadísticas.</p>
        )}
      </div>

      {mostrarGrafico && (
        <GraficoModal
          usuario={usuarioSeleccionado}
          onClose={() => { reproducirSonido("/sonidos/efectos/seleccion.mp3"); setMostrarGrafico(false); }}
        />
      )}

      {mostrarComparativo && (
  <GraficoComparativo
    usuarios={usuariosConResultados}
    onClose={() => { reproducirSonido("/sonidos/efectos/seleccion.mp3"); setMostrarComparativo(false); }}
  />
)}

    </div>
  );
}
