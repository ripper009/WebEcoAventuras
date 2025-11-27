import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./estadisticas.css";

ChartJS.register(LineElement, BarElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function GraficoModal({ usuario, onClose }) {
  if (!usuario || !usuario.resultados || usuario.resultados.length === 0) {
    return <p>❌ No hay datos suficientes para mostrar estadísticas.</p>;
  }

  const formatearFecha = (fechaRaw) => {
    const fecha = fechaRaw instanceof Date
      ? fechaRaw
      : fechaRaw?.toDate?.() || new Date(fechaRaw);
    return fecha instanceof Date && !isNaN(fecha)
      ? fecha.toLocaleDateString("es-ES")
      : "Fecha inválida";
  };

  // 📈 Evolución temporal
  const fechas = usuario.resultados.map(r => formatearFecha(r.fecha));
  const correctas = usuario.resultados.map(r => r.correctas);
  const incorrectas = usuario.resultados.map(r => r.incorrectas);

  const dataLine = {
    labels: fechas,
    datasets: [
      {
        label: "✅ Correctas",
        data: correctas,
        borderColor: "#228B22",
        backgroundColor: "rgba(34,139,34,0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: "❌ Incorrectas",
        data: incorrectas,
        borderColor: "#8B4513",
        backgroundColor: "rgba(139,69,19,0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  // 📊 Estadísticas por categoría
  const statsPorCategoria = {};
  usuario.resultados.forEach(r => {
    const cat = r.categoria || "Sin categoría";
    if (!statsPorCategoria[cat]) {
      statsPorCategoria[cat] = { total: 0, correctas: 0, incorrectas: 0 };
    }
    statsPorCategoria[cat].total += 1;
    statsPorCategoria[cat].correctas += r.correctas;
    statsPorCategoria[cat].incorrectas += r.incorrectas;
  });

  const categorias = Object.keys(statsPorCategoria);
  const correctasProm = categorias.map(cat =>
    (statsPorCategoria[cat].correctas / statsPorCategoria[cat].total).toFixed(2)
  );
  const incorrectasProm = categorias.map(cat =>
    (statsPorCategoria[cat].incorrectas / statsPorCategoria[cat].total).toFixed(2)
  );

  const dataBar = {
    labels: categorias,
    datasets: [
      {
        label: "✅ Promedio correctas",
        data: correctasProm,
        backgroundColor: "rgba(34,139,34,0.6)"
      },
      {
        label: "❌ Promedio incorrectas",
        data: incorrectasProm,
        backgroundColor: "rgba(139,69,19,0.6)"
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeOutQuart"
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Fecha / Categoría",
          color: "#fff"
        },
        ticks: {
          color: "#fff",
          maxRotation: 45,
          minRotation: 30
        }
      },
      y: {
        title: {
          display: true,
          text: "Respuestas",
          color: "#fff"
        },
        ticks: {
          color: "#fff",
          stepSize: 1
        },
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        labels: {
          color: "#fff"
        }
      },
      tooltip: {
        mode: "index",
        intersect: false
      }
    }
  };

  const exportarInformeUsuario = async () => {
    const elemento = document.querySelector(".grafico-contenido");
    const canvas = await html2canvas(elemento, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.setFontSize(16);
    pdf.text(`📄 Informe de rendimiento: ${usuario.nombre}`, 10, 20);
    pdf.text(`Correo: ${usuario.correo || "No disponible"}`, 10, 30);
    pdf.text(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, 10, 40);
    pdf.setDrawColor(150);
    pdf.line(10, 45, 200, 45);
    pdf.addImage(imgData, "PNG", 10, 50, 190, 100);

    pdf.setFontSize(12);
    pdf.text("📂 Rendimiento por categoría:", 10, 160);
    let y = 170;
    Object.entries(statsPorCategoria).forEach(([cat, datos]) => {
      pdf.text(`• ${cat}: ${datos.total} quizzes, ✅ ${(datos.correctas / datos.total).toFixed(1)}, ❌ ${(datos.incorrectas / datos.total).toFixed(1)}`, 10, y);
      y += 8;
    });

    pdf.setFontSize(10);
    pdf.text("Generado por EcoAventuras", 10, 285);
    pdf.save(`informe-${usuario.nombre}.pdf`);
  };

  return (
    <div className="modal-grafico">
      <div className="grafico-contenido">
        <h4>📈 Evolución temporal de respuestas</h4>
        <div className="grafico-scroll">
          <Line data={dataLine} options={options} />
        </div>

        <h4 style={{ marginTop: "2rem" }}>📊 Promedio por categoría</h4>
        <div className="grafico-scroll">
          <Bar data={dataBar} options={options} />
        </div>

        <div className="botones-grafico">
          <button onClick={exportarInformeUsuario}>📄 Exportar informe PDF</button>
          <button onClick={onClose}>❌ Cerrar</button>
        </div>
      </div>
    </div>
  );
}
