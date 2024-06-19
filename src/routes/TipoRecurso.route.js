import { Router } from "express";
import { listarTipoRecurso, RegistroTipoRecurso, ActualizarTipoRecurso, BuscarTipoRecurso, DesactivarTipoRecurso } from "../controllers/TipoRecurso.controller.js";
import { validarRer } from "../../validate/TrecursoValidate.js";
import { validarRea } from "../../validate/TrecursoValidate.js";

import { validarToken } from "../controllers/autenticacion.js";

const rutaDeTipoRecurso = Router()

rutaDeTipoRecurso.get("/listarRecurso", validarToken, listarTipoRecurso);
rutaDeTipoRecurso.post("/RegistroRecurso", validarToken, validarRer,  RegistroTipoRecurso);
rutaDeTipoRecurso.put("/actualizarRecurso/:id",validarToken, validarRea, ActualizarTipoRecurso);
rutaDeTipoRecurso.put("/desactivar/Recurso/:id", validarToken, DesactivarTipoRecurso);
rutaDeTipoRecurso.get("/buscarRecurso/:nombre", validarToken, BuscarTipoRecurso);

export  default rutaDeTipoRecurso ;

