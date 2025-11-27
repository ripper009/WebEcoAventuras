import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { reproducirSonido } from "../../utils/sonidos";
import "../../styles/animations.css";
import "./quizz.css";
import { useNavigate } from "react-router-dom";

export default function Quizz({ usuario }) {
  const [cuestionarios, setCuestionarios] = useState([]);
  const [cuestionarioSeleccionado, setCuestionarioSeleccionado] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [finalizado, setFinalizado] = useState(false);
  const [correctas, setCorrectas] = useState(0);
  const [incorrectas, setIncorrectas] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(300);
  const [inicioQuizz, setInicioQuizz] = useState(null);
  const navigate = useNavigate();

  const volverAlExplorador = () => {
    reproducirSonido("/sonidos/efectos/seleccion.mp3");
    navigate("/explorador");
  };

  useEffect(() => {
    const fondo = new Audio("/sonidos/fondo/musica-relajante.mp3");
    fondo.loop = true;
    fondo.volume = 0.3;
    fondo.play();
    return () => fondo.pause();
  }, []);

  useEffect(() => {
    const cargarCuestionarios = async () => {
      const snapshot = await getDocs(collection(db, "cuestionarios"));
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCuestionarios(lista);
    };
    cargarCuestionarios();
  }, []);

  const cargarPreguntasDelCuestionario = async (cuestionarioId) => {
    const snapshot = await getDocs(collection(db, "cuestionarios", cuestionarioId, "preguntas"));
    const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPreguntas(lista);
    setInicioQuizz(Date.now());
  };

  useEffect(() => {
    if (finalizado) return;
    const intervalo = setInterval(() => {
      setTiempoRestante(t => {
        if (t <= 1) {
          clearInterval(intervalo);
          calcularResultados();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalo);
  }, [finalizado]);

  const manejarRespuesta = (id, opcion) => {
    reproducirSonido("/sonidos/efectos/seleccion.mp3");
    setRespuestas(prev => ({ ...prev, [id]: opcion }));
  };

  const avanzarPregunta = () => {
    reproducirSonido("/sonidos/efectos/seleccion.mp3");
    setPreguntaActual(p => p + 1);
  };

  const finalizarQuizz = () => {
    reproducirSonido("/sonidos/efectos/seleccion.mp3");
    calcularResultados();
  };

  const calcularResultados = async () => {
    const finQuizz = Date.now();
    const duracionSegundos = Math.floor((finQuizz - inicioQuizz) / 1000);

    const correctasTemp = preguntas.filter(
      p => respuestas[p.id] === p.opciones[p.correcta]
    ).length;

    const incorrectasTemp = preguntas.length - correctasTemp;

    const sonidoResultado = correctasTemp >= incorrectasTemp
      ? "/sonidos/efectos/correcto.mp3"
      : "/sonidos/efectos/incorrecto.mp3";
    reproducirSonido(sonidoResultado);

    try {
      await addDoc(collection(db, "resultadosQuizz"), {
        usuarioId: usuario.uid,
        nombre: usuario.displayName || "Explorador",
        email: usuario.email,
        correctas: correctasTemp,
        incorrectas: incorrectasTemp,
        fecha: Timestamp.now(),
        duracion: duracionSegundos,
        respuestas,
        cuestionarioId: cuestionarioSeleccionado.id,
        cuestionarioNombre: cuestionarioSeleccionado.nombre
      });

      setCorrectas(correctasTemp);
      setIncorrectas(incorrectasTemp);
      setFinalizado(true);
    } catch (error) {
      console.error("Error al guardar resultados:", error);
      alert("❌ No se pudo guardar el resultado");
    }
  };

  return (
    <div className="quizz-panel">
      <h2>🧠 Quizz ambiental</h2>
      <p>Explorador: <strong>{usuario.displayName}</strong></p>

      {!cuestionarioSeleccionado ? (
        <div className="seleccion-cuestionario">
          <h3>🗂️ Elige un cuestionario</h3>
          <ul>
            {cuestionarios.map(c => (
              <li key={c.id}>
                <button onClick={() => {
                  setCuestionarioSeleccionado(c);
                  cargarPreguntasDelCuestionario(c.id);
                }}>
                  {c.nombre} — <em>{c.categoria}</em>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : !finalizado && preguntas.length > 0 ? (
        <>
          <p>⏳ Tiempo restante: {Math.floor(tiempoRestante / 60)}:{(tiempoRestante % 60).toString().padStart(2, "0")}</p>
          <div className="preguntas-lista">
            <div className="pregunta-card fade-in">
              <h4>{preguntas[preguntaActual].texto}</h4>
              <div className="opciones">
                {preguntas[preguntaActual].opciones.map((opcion, i) => (
                  <label key={i} className={`opcion ${respuestas[preguntas[preguntaActual].id] === opcion ? "seleccionada" : ""}`}>
                    <input
                      type="radio"
                      name={`pregunta-${preguntas[preguntaActual].id}`}
                      value={opcion}
                      checked={respuestas[preguntas[preguntaActual].id] === opcion}
                      onChange={() => manejarRespuesta(preguntas[preguntaActual].id, opcion)}
                    />
                    {opcion}
                  </label>
                ))}
              </div>
              {preguntaActual < preguntas.length - 1 ? (
                <button className="finalizar-btn" onClick={avanzarPregunta}>
                  ➡️ Siguiente
                </button>
              ) : (
                <button className="finalizar-btn" onClick={finalizarQuizz}>
                  ✅ Finalizar quizz
                </button>
              )}
            </div>
          </div>
        </>
      ) : finalizado ? (
        <div className="resultados fade-in">
          <h3>📊 Resultados</h3>
          <p>Correctas: <strong>{correctas}</strong></p>
          <p>Incorrectas: <strong>{incorrectas}</strong></p>
          <p>Duración: <strong>{Math.floor((correctas + incorrectas) > 0 ? (correctas + incorrectas) * 10 : 0)} segundos</strong></p>
          <button className="finalizar-btn" onClick={volverAlExplorador}>
            🔙 Volver al panel de explorador
          </button>
        </div>
      ) : (
        <p>🔄 Cargando preguntas...</p>
      )}
    </div>
  );
}
