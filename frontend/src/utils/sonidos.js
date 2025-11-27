export const reproducirSonido = (ruta, volumen = 0.5) => {
  const audio = new Audio(ruta);
  audio.volume = volumen;
  audio.play();
};
