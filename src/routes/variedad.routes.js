import { Router } from "express";
import { registrarVariedad, listarVariedades, actualizarVariedad,  buscarVariedad, DesactivarVariedad } from "../controllers/variedad.controller.js";
import { validarRegistroVariedad, validarActualizacionVariedad } from "../../validate/validarVariedad.js";

import { validarToken } from "../controllers/autenticacion.js";

const rutaDeVariedad = Router();

rutaDeVariedad.post("/registrarVariedad", validarToken, validarRegistroVariedad, registrarVariedad);
rutaDeVariedad.get("/listarVariedades", validarToken, listarVariedades);
rutaDeVariedad.put("/actualizarVariedad/:id", validarToken, validarActualizacionVariedad, actualizarVariedad);
rutaDeVariedad.put("/desactivar/Variedad/:id", validarToken, DesactivarVariedad);
rutaDeVariedad.get("/buscarVariedad/:nombre", validarToken, buscarVariedad);

export default rutaDeVariedad;


