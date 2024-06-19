import { Router } from "express";
import { Actualizarlote, Buscarlote,  Registrarlotes, listarlotes,DesactivarLote } from "../controllers/lotes.controller.js";
import { validarlotes, validarlotesactualizar } from "../../validate/lotes.validacion.js";
import { validarToken } from "../controllers/autenticacion.js";

const rutalote = Router();

rutalote.get("/listarlote", validarToken, listarlotes);
rutalote.post("/Registrarlote", validarToken, validarlotes, Registrarlotes);
rutalote.put("/Actualizarlote/:id_lote", validarToken, validarlotesactualizar, Actualizarlote)
rutalote.put("/desactivar/Lote/:id", validarToken, DesactivarLote);
rutalote.get("/Buscarlote/:nombre", validarToken, Buscarlote);


export default rutalote ;
