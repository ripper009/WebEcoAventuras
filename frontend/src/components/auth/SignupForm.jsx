// src/components/SignupForm.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function SignupForm({ onSignup }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("explorador");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        nombre,
        correo: email,
        rol
      });

      user.displayName = nombre; // opcional para saludo
      onSignup(user);
    } catch (error) {
      alert("Error al registrarse: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
      <input type="email" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
      <select value={rol} onChange={e => setRol(e.target.value)}>
        <option value="explorador">Explorador</option>
        <option value="admin">Administrador</option>
      </select>
      <button type="submit">Crear cuenta</button>
    </form>
  );
}
