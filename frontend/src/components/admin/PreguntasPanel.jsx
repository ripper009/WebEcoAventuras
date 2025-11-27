import { useEffect, useState } from "react";
import { db } from "../../FirebaseConfig";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import "./preguntas.css";

export default function CuestionariosPanel() {
  const [cuestionarios, setCuestionarios] = useState([]);
  const [cuestionarioActivo, setCuestionarioActivo] = useState(null);
  const [nuevoCuestionario, setNuevoCuestionario] = useState({
    nombre: "",
    categoria: ""
  });
  const [nuevaPregunta, setNuevaPregunta] = useState({
    texto: "",
    opciones: ["", "", "", ""],
    correcta: 0
  });
  const [editandoId, setEditandoId] = useState(null);
  const [preguntas, setPreguntas] = useState([]);

  const cargarCuestionarios = async () => {
    const snapshot = await getDocs(collection(db, "cuestionarios"));
    const lista = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setCuestionarios(lista);
  };

  const crearCuestionario = async () => {
    if (!nuevoCuestionario.nombre || !nuevoCuestionario.categoria) return alert("Completa nombre y categoría");
    const ref = await addDoc(collection(db, "cuestionarios"), nuevoCuestionario);
    setNuevoCuestionario({ nombre: "", categoria: "" });
    cargarCuestionarios();
    setCuestionarioActivo({ id: ref.id, ...nuevoCuestionario });
    setPreguntas([]);
  };

  const cargarPreguntas = async (cuestionarioId) => {
    const snapshot = await getDocs(collection(db, "cuestionarios", cuestionarioId, "preguntas"));
    const lista = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setPreguntas(lista);
  };

  const agregarPregunta = async () => {
    const ref = collection(db, "cuestionarios", cuestionarioActivo.id, "preguntas");
    await addDoc(ref, nuevaPregunta);
    setNuevaPregunta({ texto: "", opciones: ["", "", "", ""], correcta: 0 });
    cargarPreguntas(cuestionarioActivo.id);
  };

  const eliminarPregunta = async (id) => {
    const ref = doc(db, "cuestionarios", cuestionarioActivo.id, "preguntas", id);
    await deleteDoc(ref);
    cargarPreguntas(cuestionarioActivo.id);
  };

  const iniciarEdicion = (pregunta) => {
    setNuevaPregunta({ ...pregunta });
    setEditandoId(pregunta.id);
  };

  const guardarEdicion = async () => {
    const ref = doc(db, "cuestionarios", cuestionarioActivo.id, "preguntas", editandoId);
    await updateDoc(ref, nuevaPregunta);
    setNuevaPregunta({ texto: "", opciones: ["", "", "", ""], correcta: 0 });
    setEditandoId(null);
    cargarPreguntas(cuestionarioActivo.id);
  };

  useEffect(() => {
    cargarCuestionarios();
  }, []);

  return (
    <div className="cuestionarios-panel">
      <h2>📚 Panel de administración de cuestionarios</h2>

      <div className="formulario-cuestionario">
        <input
          type="text"
          placeholder="Nombre del cuestionario"
          value={nuevoCuestionario.nombre}
          onChange={e => setNuevoCuestionario({ ...nuevoCuestionario, nombre: e.target.value })}
        />
        <input
          type="text"
          placeholder="Categoría (ej. Ecología, Historia...)"
          value={nuevoCuestionario.categoria}
          onChange={e => setNuevoCuestionario({ ...nuevoCuestionario, categoria: e.target.value })}
        />
        <button onClick={crearCuestionario}>➕ Crear cuestionario</button>
      </div>

      <div className="lista-cuestionarios">
        <h3>📂 Cuestionarios existentes</h3>
        <ul>
          {cuestionarios.map(c => (
            <li key={c.id}>
              <strong>{c.nombre}</strong> — <em>{c.categoria}</em>
              <button onClick={() => {
                setCuestionarioActivo(c);
                cargarPreguntas(c.id);
              }}>📋 Ver preguntas</button>
            </li>
          ))}
        </ul>
      </div>

      {cuestionarioActivo && (
        <div className="panel-preguntas">
          <h3>🧠 Preguntas de: {cuestionarioActivo.nombre}</h3>
          <div className="formulario-pregunta">
            <input
              type="text"
              placeholder="Texto de la pregunta"
              value={nuevaPregunta.texto}
              onChange={e =>
                setNuevaPregunta({ ...nuevaPregunta, texto: e.target.value })
              }
            />
            {nuevaPregunta.opciones.map((op, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Opción ${i + 1}`}
                value={op}
                onChange={e => {
                  const nuevas = [...nuevaPregunta.opciones];
                  nuevas[i] = e.target.value;
                  setNuevaPregunta({ ...nuevaPregunta, opciones: nuevas });
                }}
              />
            ))}
            <select
              value={nuevaPregunta.correcta}
              onChange={e =>
                setNuevaPregunta({
                  ...nuevaPregunta,
                  correcta: parseInt(e.target.value)
                })
              }
            >
              <option value={0}>Opción 1</option>
              <option value={1}>Opción 2</option>
              <option value={2}>Opción 3</option>
              <option value={3}>Opción 4</option>
            </select>

            {editandoId ? (
              <button onClick={guardarEdicion}>💾 Guardar cambios</button>
            ) : (
              <button onClick={agregarPregunta}>➕ Agregar pregunta</button>
            )}
          </div>

          <ul className="preguntas-listado">
            {preguntas.map(p => (
              <li key={p.id}>
                <strong>{p.texto}</strong>
                <ul>
                  {p.opciones.map((op, i) => (
                    <li key={i} className={i === p.correcta ? "correcta" : ""}>
                      {op}
                    </li>
                  ))}
                </ul>
                <button onClick={() => iniciarEdicion(p)}>✏️ Editar</button>
                <button onClick={() => eliminarPregunta(p.id)}>🗑️ Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
