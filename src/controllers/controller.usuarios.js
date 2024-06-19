import { pool } from '../database/conexion.js';
import { validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, img, cb) {
        cb(null, "public/img");
    },
    filename: function (req, img, cb) {
        cb(null, img.originalname);
    }
});

const upload = multer({ storage: storage });
export const cargarImagen = upload.single('img');

export const listarUsuarios = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM usuarios');
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                status: 404,
                message: 'No hay usuarios registrados'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error en el sistema: ' + error
        });
    }
};

export const buscarUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const [result] = await pool.query("SELECT id_usuario, nombre, apellido, correo, imagen FROM usuarios WHERE id_usuario=?", [id_usuario]);

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                status: 404,
                message: "No se encontro el usuario"
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error en el sistema: ' + error
        });
    }
};

export const registrarUsuario = async (req, res) => {
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


export const actualizarUsuario = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { nombre, apellido, correo, password, rol, estado } = req.body;

        if (!nombre && !apellido && !correo  && !req.file) {
            return res.status(400).json({ message: 'Al menos uno de los campos (nombre, apellido, correo, password, rol, estado, imagen) debe estar presente en la solicitud para realizar la actualización.' });
        }

        console.log("ID del usuario a actualizar:", id);

        const [oldUsuarioRows] = await pool.query("SELECT * FROM usuarios WHERE id_usuario = ?", [id]);

        console.log("Resultado de la consulta:", oldUsuarioRows);

        if (oldUsuarioRows.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'Usuario no encontrado',
            });
        }

        const oldUsuario = oldUsuarioRows[0];
        let imagen = oldUsuario.imagen;

        if (req.file) {
            imagen = req.file.path;
        }

        const updatedUsuario = {
            nombre: nombre || oldUsuario.nombre,
            apellido: apellido || oldUsuario.apellido,
            correo: correo || oldUsuario.correo,
            password: password ? await bcrypt.hash(password, 10) : oldUsuario.password,
            rol: rol || oldUsuario.rol,
            estado: estado || oldUsuario.estado,
            imagen: imagen
        };

        const [result] = await pool.query(
            `UPDATE usuarios SET nombre=?, apellido=?, correo=?, password=?, rol=?, estado=?, imagen=? WHERE id_usuario = ?`,
            [updatedUsuario.nombre, updatedUsuario.apellido, updatedUsuario.correo, updatedUsuario.password, updatedUsuario.rol, updatedUsuario.estado, updatedUsuario.imagen, id]
        );

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


export const desactivarUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const [result] = await pool.query("UPDATE usuarios SET estado='inactivo' WHERE id_usuario=?", [id_usuario]);

        if (result.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                message: "El estado del usuario ha sido cambiado exitosamente"
            });
        } else {
            res.status(404).json({
                status: 404,
                message: "No se pudo cambiar el estado del usuario"
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error en el sistema: ' + error
        });
    }
};

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
