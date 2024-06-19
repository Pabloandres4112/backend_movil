import { Router } from "express";
import { listarFinca, RegistroFinca, ActualizarFinca, BuscarFinca, DesactivarFinca, DesactivarFincaencadena } from "../controllers/Finca.controller.js";
import { validarFincaA } from "../../validate/Finca.js";
import { validarFincaR } from "../../validate/Finca.js";
import { validarToken } from "../controllers/autenticacion.js";

const router = Router();

router.get("/listarFinca", validarToken, listarFinca);
router.post("/RegistroFinca", validarToken, validarFincaR, RegistroFinca);
router.put("/actualizarFinca/:id", validarToken, validarFincaA, ActualizarFinca);
router.put("/desactivar/Finca/:id", validarToken, DesactivarFinca);
router.get("/buscarFinca/:nombre", validarToken, BuscarFinca);
router.put("/desactivarEncadena/Finca/:id", DesactivarFincaencadena);



export default router;

