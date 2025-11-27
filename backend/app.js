// backend/app.js
const express = require("express");
const cors = require("cors");
const { db } = require("./firebaseAdmin");

const app = express();
app.use(cors());
app.use(express.json()); // ✅ importante para recibir JSON

const PORT = 3001;

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡EcoAventuras backend funcionando!");
});

// Obtener todos los usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const snapshot = await db.collection("usuarios").get();
    const usuarios = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Editar usuario por ID
app.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, rol } = req.body;

  try {
    await db.collection("usuarios").doc(id).update({ nombre, correo, rol });
    res.json({ mensaje: "Usuario actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Express en http://localhost:${PORT}`);
});

app.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection("usuarios").doc(id).delete();
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});
