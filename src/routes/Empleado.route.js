import { Router } from "express"
import { cargarImagen,actualizarEmpleado, listarEmpleado, buscarEmpleado, DesactivarEmpleado, registrarEmpleado, desactivarUsuarioEnCadena, buscarUsuari, acutualizarUsuario } from '../controllers/Empleado.controller.js'
import { validarRegiEmpleado, validarActuEmpleado } from '../../validate/EmpleadoValidar.js'
import { validarToken } from '../controllers/autenticacion.js'

const rutaUsuario = Router();

rutaUsuario.get('/listarEmpleado', validarToken, listarEmpleado);
rutaUsuario.post('/registrarEmpleado', validarToken, validarRegiEmpleado, registrarEmpleado, cargarImagen);
rutaUsuario.put('/actualizarEmpleado/:id', validarActuEmpleado, actualizarEmpleado, cargarImagen);
rutaUsuario.put("/desactivar/Empleado/:id", validarToken, DesactivarEmpleado);
rutaUsuario.get('/buscarEmpleado/:nombre', validarToken, buscarEmpleado);
rutaUsuario.post('/desactivarUsuarioEnCadena/:id', desactivarUsuarioEnCadena);

rutaUsuario.get('/buscarUsuario/:id_usuario', buscarUsuari);
rutaUsuario.put('/actualizarUsuarioMovil/:id_usuario',cargarImagen, acutualizarUsuario);





export default rutaUsuario;
