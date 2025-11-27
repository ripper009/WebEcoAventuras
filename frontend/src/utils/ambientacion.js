// src/utils/ambientacion.js
export function aplicarFondoPorHora() {
  const hora = new Date().getHours();
  let fondo = "";

  if (hora >= 6 && hora < 12) {
    fondo = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80";
  } else if (hora >= 12 && hora < 18) {
    fondo = "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1600&q=80";
  } else {
    fondo = "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80";
  }

  document.body.style.backgroundImage = `url('${fondo}')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.transition = "background-image 0.5s ease-in-out";
}
