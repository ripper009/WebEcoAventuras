// src/utils/saludoVoz.js
export function saludarConVoz(nombre = "Explorador") {
  const hora = new Date().getHours();
  const saludoBase = hora < 12 ? "Buenos días" : hora < 18 ? "Buenas tardes" : "Buenas noches";
  const texto = `${saludoBase}, ${nombre}. Bienvenido a EcoAventuras.`;

  const mensaje = new SpeechSynthesisUtterance(texto);
  mensaje.lang = "es-ES";
  mensaje.rate = 1;
  mensaje.pitch = 1.2;
  window.speechSynthesis.speak(mensaje);
}
