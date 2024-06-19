import { Router } from "express";
import { cambiarContrasena, validarIdentidad } from "../controllers/olvideContraseña.js";

const OlvideContraseña = Router();


// Ruta para validar la identidad del usuario
OlvideContraseña.post('/validar-identidad', validarIdentidad);

// Ruta para cambiar la contraseña del usuario
OlvideContraseña.put('/cambiar-contrasena/:identificacion', cambiarContrasena);

export default OlvideContraseña;