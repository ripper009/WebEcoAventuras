import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./tutoriales.css";

// ✅ Ruta corregida según jerarquía
const videosImportados = import.meta.glob("../../assets/videos/*.mp4", { eager: true });

export default function Tutoriales() {
  const [videoSeleccionado, setVideoSeleccionado] = useState(null);
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const listaVideos = Object.entries(videosImportados)
      .filter(([_, modulo]) => modulo?.default)
      .map(([ruta, modulo], index) => {
        const nombreArchivo = ruta.split("/").pop().replace(".mp4", "");
        const tituloFormateado = nombreArchivo
          .replace(/([A-Z])/g, " $1")
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        return {
          id: index + 1,
          titulo: tituloFormateado,
          url: modulo.default,
        };
      });

    setVideos(listaVideos);
  }, []);

  return (
    <div className="tutoriales-container">
      <div className="tutoriales-header">
        <h2>🌿 Tutoriales EcoAventuras</h2>
        <p>Aprender a recorrer el mundo de EcoAventuras.</p>
      </div>

      <div className="tutoriales-scroll">
        <div className="videos-list">
          {videos.map((video) => (
            <button
              key={video.id}
              className="video-button"
              onClick={() => setVideoSeleccionado(video.url)}
            >
              📘 {video.titulo}
            </button>
          ))}
        </div>

        {videoSeleccionado && (
          <div className="video-decorado-wrapper">
            <div className="televisor-bosque">
              <div className="televisor-header">
                <span className="icono-video">🎬</span>
                <h3 className="titulo-video">TUTORIALES</h3>
              </div>
              <div className="pantalla-video">
  <video key={videoSeleccionado} controls width="100%">
    <source src={videoSeleccionado} type="video/mp4" />
    Tu navegador no soporta el video.
  </video>
</div>

            </div>
          </div>
        )}

        <div className="botones-navegacion">
          <button className="back-button" onClick={() => navigate(-1)}>
            ⬅️ Volver
          </button>
        </div>
      </div>
    </div>
  );
}
