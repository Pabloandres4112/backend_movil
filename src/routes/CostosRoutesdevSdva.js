import { Router } from "express";
import {registrar,  actualizar,  buscar, listar } from '../controllers/CostosControllerdevSdva.js';
import { validacionCostosA, validacionCostosR } from "../../validate/CostosValidatedevSdva.js";
import { validarToken } from "../controllers/autenticacion.js"; 

const rutaCostos = Router();

rutaCostos.get('/listar_costos', validarToken, listar);
rutaCostos.post('/registrar', validarToken, validacionCostosR, registrar);
rutaCostos.get('/buscar/:id_costos', validarToken, buscar); 
rutaCostos.put('/actualizar/:id_costos',validarToken, validacionCostosA, actualizar);


export default rutaCostos;