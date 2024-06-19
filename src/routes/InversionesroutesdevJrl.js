import { Router } from "express";
import { Validateinversiones, actualizar} from "../../validate/InversioesdevJrl.js";
import { BuscarInversiones, actualizarInversiones, listarInversiones, registrarInversiones} from "../controllers/InvesionescontrollerdevJrl.js";
import { validarToken } from "../controllers/autenticacion.js";

const inversiones = Router()


inversiones.get('/listarInversion',validarToken,listarInversiones)
inversiones.post('/RegistrarInversion',validarToken,Validateinversiones, registrarInversiones)
inversiones.get('/BuscarInversion/:id_Inversiones',validarToken,BuscarInversiones)
inversiones.put('/ActualizarInversion/:id_Inversiones',validarToken,actualizar, actualizarInversiones)


export default inversiones
//nn

