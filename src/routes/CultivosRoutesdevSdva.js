import { Router } from "express";
import {registrar,  actualizar,  buscar, listar, desactivar, desactivarCultivo } from '../controllers/CultivosControllerdevSdva.js';
import { validacionCultivosA, validacionCultivosR } from "../../validate/CultivosValidatedevSdva.js";
import { validarToken } from "../controllers/autenticacion.js"; 


const rutaCultivos = Router();

rutaCultivos.get('/listarCultivos', validarToken, listar);
rutaCultivos.post('/registrarCultivos', validarToken, validacionCultivosR, registrar);
rutaCultivos.get('/buscarCultivo/:nombre', validarToken, buscar); 
rutaCultivos.put('/actualizarCultivo/:id_cultivo', validarToken, validacionCultivosA, actualizar);
rutaCultivos.put("/desactivar/Cultivo/:id", validarToken, desactivar);
rutaCultivos.put("/desactivarEnCadena/Cultivo/:id", desactivarCultivo);
export default rutaCultivos;