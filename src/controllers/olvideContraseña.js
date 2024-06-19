
import { pool } from '../database/conexion.js';
export const validarIdentidad = async (req, res) => {
  const { correo, identificacion } = req.body;

  try {
    const query = 'SELECT * FROM usuarios WHERE correo = ? AND identificacion = ?';
    const [rows] = await pool.query(query, [correo, identificacion]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Identificación o correo no encontrado' });
    }

    return res.status(200).json({ usuario: rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

import bcrypt from 'bcrypt';

export const cambiarContrasena = async (req, res) => {
  const { identificacion } = req.params;
  const { nuevaContrasena } = req.body;

  // Verificar si nuevaContrasena está vacía o nula
  if (!nuevaContrasena) {
    return res.status(400).json({ mensaje: 'La nueva contraseña es requerida' });
  }

  try {
    // Encriptar la nueva contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

    const query = 'UPDATE usuarios SET password = ? WHERE identificacion = ?';
    const [result] = await pool.query(query, [hashedPassword, identificacion]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Identificación no encontrada' });
    }

    return res.status(200).json({ mensaje: 'Contraseña cambiada exitosamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error del servidor' });
  }
};


