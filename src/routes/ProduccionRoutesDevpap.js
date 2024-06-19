import { Router } from "express";

import { BuscarProduccion, actualizarProduccion, listarProduccion, registrarProduccion } from "../controllers/ProduccionControllerDevpap.js";
import { ValidateProduccion, actualizar } from "../../validate/ProduccionValidateDevpap.js";
import { validarToken } from "../controllers/autenticacion.js";


const produccion = Router()

produccion.get('/listarProduccion', validarToken, listarProduccion);
produccion.post('/RegistraProduccion', validarToken, ValidateProduccion, registrarProduccion);
produccion.get('/BuscarProduccion/:nombre', validarToken, BuscarProduccion);
produccion.put('/ActualizarProduccion/:id_producccion', validarToken, actualizar, actualizarProduccion);
export default produccion