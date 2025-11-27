import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { aplicarFondoPorHora } from "../../utils/ambientacion";
import { saludarConVoz } from "../../utils/saludoVoz";
import "./clima.css";

export default function CambioClimatico({ usuario }) {
  const [tab, setTab] = useState("intro");
  const navigate = useNavigate();

  useEffect(() => {
    aplicarFondoPorHora();
    saludarConVoz(`Explorador, hoy aprendemos sobre el clima`);
  }, []);

  const labelMap = {
    intro: "Intro",
    quillacollo: "Quillacollo",
    evidencias: "Evidencias",
    causas: "Causas",
    efectos: "Efectos",
    acciones: "Acciones",
    recursos: "Recursos"
  };

  return (
    <div className="clima-container">
      <header className="clima-header">
        <h1>🌍 Cambio Climático</h1>
        <p className="clima-subtitle">
          Entiende qué está pasando, por qué y qué puedes hacer desde Cochabamba.
        </p>
      </header>

      {/* Botón de retroceder */}
      <div className="clima-back">
        <button type="button" className="back-btn" onClick={() => navigate("/explorador")}>
          ⬅️ Volver 
        </button>
      </div>

      <nav className="clima-tabs" aria-label="Secciones de cambio climático">
        {Object.keys(labelMap).map(key => (
          <button
            type="button"
            key={key}
            aria-pressed={tab === key}
            className={`clima-tab ${tab === key ? "active" : ""}`}
            onClick={() => setTab(key)}
          >
            {labelMap[key]}
          </button>
        ))}
      </nav>

      <main className="clima-content">
        {tab === "intro" && <Intro usuario={usuario} />}
        {tab === "quillacollo" && <Quillacollo />}
        {tab === "evidencias" && <Evidencias />}
        {tab === "causas" && <Causas />}
        {tab === "efectos" && <Efectos />}
        {tab === "acciones" && <Acciones />}
        {tab === "recursos" && <Recursos />}
      </main>
    </div>
  );
}

/* =========================
   Secciones del contenido
   ========================= */

function Intro({ usuario }) {
  return (
    <section>
      <h2>¿Qué es el cambio climático?</h2>
      <p>
        Es la variación a largo plazo de patrones de temperatura y clima, causada
        principalmente por actividades humanas que incrementan gases de efecto invernadero.
      </p>
      <p>
        En EcoAventuras lo conectamos con tu realidad local: agua, aire, biodiversidad y salud de los ecosistemas.
      </p>
      {usuario?.displayName && <p>Bienvenido, {usuario.displayName}. ¡Explora a tu ritmo!</p>}
    </section>
  );
}


function Quillacollo() {
  return (
    <section>
      <h2>¿Qué pasa en Quillacollo?</h2>
      <p>
        1. Quillacollo enfrenta riesgos crecientes de inundaciones debido a la variabilidad climática y el crecimiento urbano en zonas vulnerables.
      </p>
      <p>
        2. Los principales desafíos locales son el aumento de temperaturas, sequías y fenómenos extremos, que afectan agricultura, agua y salud.
      </p>
      <p>
        3. La contaminación del aire en zonas urbanas agrava problemas de salud y contribuye al efecto invernadero.
      </p>
      <p>
        4. La deforestación y quema de biomasa generan tanto contaminación local como emisiones globales que intensifican el cambio climático.
      </p>
      
    </section>
  );
}

function Evidencias() {
  return (
    <section>
      <h2>Evidencias</h2>
      <ul className="clima-list">
        <li><strong>Temperaturas:</strong> En Quillacollo se observa un aumento de temperaturas promedio, con olas de calor más intensas que afectan la salud y la agricultura local.</li>
        <li><strong>Hielo y glaciar:</strong> La región depende de aguas provenientes de zonas altas de Cochabamba; el retroceso glaciar en el Tunari y cordilleras cercanas reduce la disponibilidad hídrica.</li>
        <li><strong>Eventos extremos:</strong> El municipio enfrenta sequías prolongadas que afectan cultivos y, al mismo tiempo, inundaciones recurrentes en ríos como Huayculi y Tacata, que ponen en riesgo barrios urbanos.</li>
        <li><strong>Nivel del agua:</strong> El impacto local se refleja en la variabilidad de caudales de ríos y quebradas, con crecidas repentinas que generan desbordes y daños en infraestructura.</li>
      </ul>
    </section>
  );
}

function Causas() {
  return (
    <section>
      <h2>Causas principales</h2>
      <ul className="clima-list">
        <li><strong>Energía fósil:</strong> Electricidad y transporte basados en carbón, petróleo y gas.</li>
        <li><strong>Uso de suelo:</strong> Deforestación y cambio de cobertura.</li>
        <li><strong>Industria y residuos:</strong> Procesos con alta huella y metano en vertederos.</li>
        <li><strong>Agricultura:</strong> Emisiones de metano y óxido nitroso.</li>
      </ul>
    </section>
  );
}

function Efectos() {
  return (
    <section>
      <h2>Efectos en personas y ecosistemas</h2>
      <ul className="clima-list">
        <li><strong>Agua:</strong> Alteración de ciclos de lluvia y disponibilidad.</li>
        <li><strong>Salud:</strong> Riesgo por calor extremo y calidad del aire.</li>
        <li><strong>Biodiversidad:</strong> Migraciones, pérdida de hábitats y especies.</li>
        <li><strong>Economía:</strong> Impactos en agricultura, infraestructura y turismo.</li>
      </ul>
    </section>
  );
}

function Acciones() {
  return (
    <section>
      <h2>Acciones prácticas</h2>
      <ul className="clima-list">
        <li><strong>Energía:</strong> Eficiencia, iluminación LED y consumo responsable.</li>
        <li><strong>Movilidad:</strong> Caminar, bicicleta, transporte público y carpooling.</li>
        <li><strong>Residuos:</strong> Reducir, reutilizar, reciclar y compostar.</li>
        <li><strong>Alimentación:</strong> Productos locales y estacionales, menos desperdicio.</li>
        <li><strong>Naturaleza:</strong> Reforestación y cuidado de áreas verdes.</li>
      </ul>
    </section>
  );
}

function Recursos() {
  return (
    <section>
      <h2>Recursos(PROXIMAMENTE)</h2>
      <ul className="clima-links">
        <li><span>Guía local de ahorro de energía </span></li>
        <li><span>Mapa de puntos de reciclaje en Cochabamba</span></li>
        <li><span>Actividades para aulas EcoAventuras</span></li>
      </ul>
    </section>
  );
}
