import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./tutoriales.css"; // estilos personalizados

export default function Tutoriales() {
  const [videoSeleccionado, setVideoSeleccionado] = useState(null);
  const navigate = useNavigate();

  const videos = [
    {
      id: 1,
      titulo: "Explora EcoAventuras",
      url: "https://www.youtube.com/embed/D2mlhUJScik", // ✅ corregido
    },
    {
      id: 2,
      titulo: "Explora el Lobby",
      url: "https://www.youtube.com/embed/7oCo8TXW5Gs",
    },
    /*{
      id: 3,
      titulo: "Energías renovables en la naturaleza",
      url: "https://www.youtube.com/embed/VIDEO_ID3",
    },*/
  ];

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
                <iframe
                  src={videoSeleccionado}
                  title="Video tutorial"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
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
