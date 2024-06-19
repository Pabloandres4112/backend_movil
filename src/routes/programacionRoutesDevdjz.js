import { Router } from "express";
import { actualizarProgramacion, registrarProgramacion, listarProgramacion, buscarProgramacion, desactivar, desactivarProgamacionCadena, listarProgramacionPorUsuario, BuscaActividadId } from "../controllers/programacionControllerDevdjz.js";

import { programacionA } from "../../validate/programacionValidateDevdjz.js"
import { programacionC } from "../../validate/programacionValidateDevdjz.js"

import { validarToken } from "../controllers/autenticacion.js"


const rutaProgramacion = Router();
//
rutaProgramacion.post("/registrarProgramacion", validarToken, programacionC, registrarProgramacion);
rutaProgramacion.get("/listarProgramacion", validarToken, listarProgramacion);
rutaProgramacion.put("/actualizarProgramacion/:id_programacion", validarToken, programacionA, actualizarProgramacion);
rutaProgramacion.get("/buscarProgramacion/:nombre", validarToken, buscarProgramacion);
rutaProgramacion.put("/desactivar/Programacion/:id", validarToken, desactivar);
rutaProgramacion.put("/desactivarEnCadena/Programacion/:id", desactivarProgamacionCadena);


rutaProgramacion.get('/listarProgramacionPorUsuario/:id_usuario',listarProgramacionPorUsuario)
rutaProgramacion.get('/BuscaActividad/:idActividad', BuscaActividadId);


export default rutaProgramacion