import { pool } from '../database/conexion.js';
import { validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

export const cargarImagen = upload.single('imagen');



export const listarEmpleado = async (req, res) => {
    try {
        // Modificamos la consulta SQL para filtrar por el rol de 'empleado'
        const [result] = await pool.query('SELECT * FROM usuarios WHERE rol = "empleado"');
        
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                status: 404,
                message: 'No hay usuarios registrados con el rol de empleado'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error en el sistema: ' + error.message
        });
    }
};




export const buscarEmpleado = async (req, res) => {
    try {
        const { nombre } = req.params;
        const [result] = await pool.query("SELECT * FROM usuarios WHERE nombre LIKE ? AND rol = 'empleado'", [`%${nombre}%`]);

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                status: 404,
                message: 'No se encontraron resultados para la búsqueda'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "error en el sistema"
        });
    }
};


export const registrarEmpleado = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }

        const { nombre, apellido, correo, password, rol } = req.body;

        // Verificar si el correo ya existe
        const [existingUser] = await pool.query(`SELECT * FROM usuarios WHERE correo = ?`, [correo]);
        if (existingUser.length > 0) {
            return res.status(400).json({ status: 400, message: 'El correo ya está en uso' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const imagen = req.file ? req.file.path : null;

        const [rows] = await pool.query(
            `INSERT INTO usuarios (nombre, apellido, correo, password, rol, imagen) VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre, apellido, correo, hashedPassword, rol, imagen]
        );

        if (rows.affectedRows > 0) {
            return res.status(200).json({
                status: 200,
                message: 'Usuario registrado exitosamente'
            });
        } else {
            return res.status(403).json({
                status: 403,
                message: 'No se pudo registrar el usuario'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            message: 'Error del servidor: ' + error
        });
    }
};




export const actualizarEmpleado = async (req, res) => {
    try {
        // Validación de los errores en la solicitud
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Extraer el id del usuario desde los parámetros
        const { id } = req.params; // Cambiar id_usuario a id
        const { nombre, apellido, correo, password, rol, estado } = req.body;

        // Verificación de que al menos un campo esté presente en la solicitud
        if (!nombre && !apellido && !correo && !password && !rol && !estado && !req.file) {
            return res.status(400).json({ message: 'Al menos uno de los campos (nombre, apellido, correo, password, rol, estado, imagen) debe estar presente en la solicitud para realizar la actualización.' });
        }

        // Consulta para obtener el usuario existente
        const [oldUsuarioRows] = await pool.query("SELECT * FROM usuarios WHERE id_usuario = ?", [id]);

        if (oldUsuarioRows.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'Usuario no encontrado',
            });
        }

        const oldUsuario = oldUsuarioRows[0];
        let imagen = oldUsuario.imagen;

        // Si se ha subido una nueva imagen, actualizar el campo de imagen
        if (req.file) {
            imagen = req.file.path;
        }

        // Creación del objeto usuario actualizado
        const updatedUsuario = {
            nombre: nombre || oldUsuario.nombre,
            apellido: apellido || oldUsuario.apellido,
            correo: correo || oldUsuario.correo,
            password: password ? await bcrypt.hash(password, 10) : oldUsuario.password,
            rol: rol || oldUsuario.rol,
            estado: estado || oldUsuario.estado,
            imagen: imagen
        };

        // Actualización del usuario en la base de datos
        const [result] = await pool.query(
            `UPDATE usuarios SET nombre=?, apellido=?, correo=?, password=?, rol=?, estado=?, imagen=? WHERE id_usuario = ?`,
            [updatedUsuario.nombre, updatedUsuario.apellido, updatedUsuario.correo, updatedUsuario.password, updatedUsuario.rol, updatedUsuario.estado, updatedUsuario.imagen, id]
        );

        // Verificación del resultado de la actualización
        if (result.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                message: "El usuario ha sido actualizado.",
                data: updatedUsuario
            });
        } else {
            res.status(404).json({
                status: 404,
                message: "No se pudo actualizar el usuario, inténtalo de nuevo."
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error en el sistema: ' + error.message
        });
    }
};



//CRUD - Desactivar
export const DesactivarEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const [oldRecurso] = await pool.query("SELECT * FROM usuarios WHERE id_usuario = ?", [id]); 
        
        const [result] = await pool.query(
            `UPDATE usuarios SET estado = ${estado ? `'${estado}'` : `'${oldRecurso[0].estado}'`} WHERE id_usuario = ?`,[id]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                message: 'Se actualizo el estado con éxito',
                result: result
            });
        } else {
            res.status(404).json({
                status: 404,
                message: 'No se encontró el estado para actualizar'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error
        });
    }
}





export const desactivarUsuarioEnCadena = async (req, res) => {
    try {
        const { id } = req.params;

        // Llamar al procedimiento almacenado
        await pool.query('CALL DesactivarUsuario(?)', [id]);

        res.status(200).json({
            status: 200,
            message: 'Se desactivó el usuario con éxito',
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error al desactivar el usuario',
            error: error.message
        });
    }
};


//pablo Movil 
export const buscarUsuari  = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const [result] = await pool.query("SELECT rol, id_usuario, nombre, apellido, correo ,password,imagen,identificacion FROM usuarios WHERE id_usuario=?", [id_usuario]);

        if (result.length > 0) {
            res.status(200).json(result[0]); // Devuelve el primer resultado encontrado
        } else {
            res.status(404).json({
                status: 404,
                message: "No se encontró un usuario con ese ID"
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error en el sistema: ' + error
        });
    }
};


// cargar imgen import path from 'path';

// Configurar multer para almacenar archivos en el disco



export const acutualizarUsuario = async (req, res) => {
    const { id_usuario } = req.params;
    const { nombre, apellido, correo, password, identificacion } = req.body; // Añade identificacion
    const imagen = req.file ? req.file.path : null;

    try {
        // Verificar si el usuario existe antes de intentar actualizarlo
        const [rows] = await pool.query("SELECT * FROM usuarios WHERE id_usuario = ?", [id_usuario]);
        if (rows.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "No se encontró el usuario con el ID proporcionado."
            });
        }

        // Encriptar la contraseña antes de actualizar, si se proporciona
        let hashedPassword;
        if (password) {
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(password, saltRounds);
        } else {
            hashedPassword = rows[0].password; // Mantener la contraseña existente si no se proporciona una nueva
        }

        // Construir la consulta de actualización dinámica
        let query = "UPDATE usuarios SET nombre=?, apellido=?, correo=?, password=?, identificacion=?";
        let params = [nombre || rows[0].nombre, apellido || rows[0].apellido, correo || rows[0].correo, hashedPassword, identificacion || rows[0].identificacion];

        if (imagen) {
            query += ", imagen=?";
            params.push(imagen);
        }

        query += " WHERE id_usuario=?";
        params.push(id_usuario);

        // Ejecutar la consulta de actualización
        const [result] = await pool.query(query, params);

        if (result.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                message: "El usuario ha sido actualizado."
            });
        } else {
            res.status(500).json({
                status: 500,
                message: "No se pudo actualizar el usuario."
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error en el sistema: ' + error
        });
    }
};
