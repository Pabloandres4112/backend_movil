import { pool } from "../database/conexion.js";
import Jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

// export const validar = async (req, res) => {
//     try {
//         const { correo, password } = req.body;
//         const sql = `SELECT * FROM usuarios WHERE correo='${correo}'`;
//         const [rows] = await pool.query(sql);

//         if (rows.length > 0) {
//             const user = rows[0];
            
          
//             if (user.estado === 'inactivo') {
//                 return res.status(403).json({ message: 'El usuario se encuentra inactivo.' });
//             }

//             const match = await bcrypt.compare(password, user.password);
//             if (match) {
//                 const token = Jwt.sign({ user }, process.env.AUT_SECRET, { expiresIn: process.env.AUT_EXPIRE });
//                 return res.status(200).json({ nombre: user.nombre, rol: user.rol, apellido: user.apellido, correo: user.correo, token: token, message: 'Token generado con éxito' , id_usuario: user.id_usuario});
//             }
//         } else {
//             return res.status(404).json({ message: 'Usuario no encontrado' });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ status: 500, message: 'Error del servidor: ' + error });
//     }
// };


export const validarToken = async (req, res, next) => {
    try {
        let tokenClient = req.headers['token']
        if (!tokenClient) {
            return res.status(403).json({ 'message': 'Token es requerido' })
        } else {
            const token = Jwt.verify(tokenClient, process.env.AUT_SECRET, (error, decoded) => {
                if (error) {
                    return res.status(403).json({ message: 'Token es obligatorio' })
                } else {
                    // Aquí verificamos el rol del usuario antes de permitir el acceso
                    if (decoded.user.rol === 'administrador' || decoded.user.rol === 'empleado') {
                        next();
                    } else {
                        return res.status(403).json({ message: 'Acceso no autorizado' });
                    }
                }
            })
        }
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error del servidor' + error })
    }
}


//////////////////////////////////

// import bcrypt from 'bcrypt';
// import Jwt from 'jsonwebtoken';
// import pool from './path_to_pool'; // Asegúrate de importar correctamente tu conexión a la base de datos

export const validar = async (req, res) => {
    try {
        const { correo, password } = req.body;
        
        // Verifica si el correo existe en la base de datos
        const sql = `SELECT * FROM usuarios WHERE correo = ?`;
        const [rows] = await pool.query(sql, [correo]);

        if (rows.length === 0) {
            // Si no se encuentra el correo, devuelve un mensaje de error
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = rows[0];

        if (user.estado === 'inactivo') {
            return res.status(403).json({ message: 'El usuario se encuentra inactivo.' });
        }

        // Verifica si la contraseña es correcta
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            // Si la contraseña no coincide, devuelve un mensaje de error
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Si la contraseña es correcta, genera un token
        const token = Jwt.sign({ user }, process.env.AUT_SECRET, { expiresIn: process.env.AUT_EXPIRE });
        return res.status(200).json({ 
            nombre: user.nombre, 
            rol: user.rol, 
            apellido: user.apellido, 
            correo: user.correo, 
            token: token, 
            message: 'Token generado con éxito',
            id_usuario: user.id_usuario 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 500, message: 'Error del servidor: ' + error });
    }
};

 