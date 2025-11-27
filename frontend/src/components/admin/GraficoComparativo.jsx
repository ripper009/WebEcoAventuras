import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Chart } from 'chart.js';

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./estadisticas.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
Chart.register(Filler);

export default function GraficoComparativo({ usuarios, onClose }) {
  if (!usuarios || usuarios.length === 0) {
    return <p>❌ No hay datos suficientes para mostrar comparaciones.</p>;
  }

  const nombres = usuarios.map(u => u.nombre || "Explorador");
  const correctasProm = usuarios.map(u =>
    (u.resultados.reduce((acc, r) => acc + r.correctas, 0) / u.resultados.length).toFixed(2)
  );
  const incorrectasProm = usuarios.map(u =>
    (u.resultados.reduce((acc, r) => acc + r.incorrectas, 0) / u.resultados.length).toFixed(2)
  );

  const data = {
    labels: nombres,
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
    animation: { duration: 1000 },
    scales: {
      x: {
        title: { display: true, text: "Exploradores", color: "#fff" },
        ticks: { color: "#fff" }
      },
      y: {
        title: { display: true, text: "Promedio de respuestas", color: "#fff" },
        ticks: { color: "#fff", stepSize: 1 },
        beginAtZero: true
      }
    },
    plugins: {
      legend: { labels: { color: "#fff" } },
      tooltip: { mode: "index", intersect: false }
    }
  };

  const exportarInformeCategoria = async () => {
    const elemento = document.querySelector(".grafico-contenido");
    const canvas = await html2canvas(elemento, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.setFontSize(16);
    pdf.text("📄 Informe comparativo por categoría", 10, 20);
    pdf.text(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, 10, 30);
    pdf.setDrawColor(150);
    pdf.line(10, 35, 200, 35);
    pdf.addImage(imgData, "PNG", 10, 40, 190, 100);

    pdf.setFontSize(12);
    pdf.text("📂 Resumen por categoría:", 10, 150);
    let y = 160;
    const categorias = {};
    usuarios.forEach(u => {
      u.resultados.forEach(r => {
        const cat = r.categoria || "Sin categoría";
        if (!categorias[cat]) categorias[cat] = { total: 0, correctas: 0, incorrectas: 0 };
        categorias[cat].total += 1;
        categorias[cat].correctas += r.correctas;
        categorias[cat].incorrectas += r.incorrectas;
      });
    });
    Object.entries(categorias).forEach(([cat, datos]) => {
      pdf.text(`• ${cat}: ${datos.total} quizzes, ✅ ${(datos.correctas / datos.total).toFixed(1)}, ❌ ${(datos.incorrectas / datos.total).toFixed(1)}`, 10, y);
      y += 8;
    });

    pdf.setFontSize(10);
    pdf.text("Generado por EcoAventuras", 10, 285);
    pdf.save("informe-categorias.pdf");
  };

  return (
    <div className="modal-grafico">
      <div className="grafico-contenido">
        <h4>📊 Comparación de rendimiento por usuario</h4>
        <div className="grafico-scroll">
          <Bar data={data} options={options} />
        </div>
        <div className="botones-grafico">
          <button onClick={exportarInformeCategoria}>📄 Exportar informe PDF</button>
          <button onClick={onClose}>❌ Cerrar</button>
        </div>
      </div>
    </div>
  );
}
