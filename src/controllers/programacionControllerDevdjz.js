import { pool } from "../database/conexion.js";
import { validationResult } from "express-validator"


export const registrarProgramacion = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors })
        }
        const { fecha_inicio, fecha_fin, fk_id_usuario, fk_id_actividad, fk_id_variedad } = req.body
        const [resultado] = await pool.query("insert into programacion(fecha_inicio, fecha_fin, fk_id_usuario, fk_id_actividad, fk_id_variedad) values (?,?,?,?,?)", [fecha_inicio, fecha_fin, fk_id_usuario, fk_id_actividad, fk_id_variedad])

        if (resultado.affectedRows > 0) {
            res.status(200).json({
                "mensaje": "Programación registrada con exito"
            })
        } else {
            res.status(400).json({
                "mensaje": "hay un error no se pudo guardar"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Error en el sistema"
        })
    }
}







// CRUD - Listar
export const listarProgramacion = async (req, res) => {
    try {
        let sql = `SELECT 
            p.id_programacion,
            p.fecha_inicio,
            p.fecha_fin,
            u.nombre AS nombre_usuario, 
            a.nombre_actividad,
            v.nombre_variedad AS nombre_variedad,
            p.estado
        FROM 
            programacion AS p
        JOIN 
            usuarios AS u ON p.fk_id_usuario = u.id_usuario
        JOIN 
            actividad AS a ON p.fk_id_actividad = a.id_actividad
        JOIN 
            variedad AS v ON p.fk_id_variedad = v.id_variedad`;

        const [result] = await pool.query(sql);

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                status: 404,
                message: 'No hay ninguna programación'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Error en el sistema'
        });
    }
}


// CRUD - Actualizar
export const actualizarProgramacion = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { id_programacion } = req.params; // Asegúrate de usar id_programacion aquí
      const { fecha_inicio, fecha_fin, fk_id_usuario, fk_id_actividad, fk_id_variedad } = req.body;
  
      if (!fecha_inicio && !fecha_fin && !fk_id_usuario && !fk_id_actividad && !fk_id_variedad) {
        return res.status(400).json({ message: 'Al menos uno de los campos (fecha_inicio, fecha_fin, fk_id_usuario, fk_id_actividad, fk_id_variedad) debe estar presente en la solicitud para realizar la actualización.' });
      }
  
      const [oldUser] = await pool.query("SELECT * FROM programacion WHERE id_programacion=?", [id_programacion]);
  
      const updateValues = {
        fecha_inicio: fecha_inicio ? fecha_inicio : oldUser[0].fecha_inicio,
        fecha_fin: fecha_fin ? fecha_fin : oldUser[0].fecha_fin,
        fk_id_usuario: fk_id_usuario ? fk_id_usuario : oldUser[0].fk_id_usuario,
        fk_id_actividad: fk_id_actividad ? fk_id_actividad : oldUser[0].fk_id_actividad,
        fk_id_variedad: fk_id_variedad ? fk_id_variedad : oldUser[0].fk_id_variedad
      };
  
      const updateQuery = `UPDATE programacion SET fecha_inicio=?, fecha_fin=?, fk_id_usuario=?, fk_id_actividad=?, fk_id_variedad=? WHERE id_programacion=?`;
  
      const [resultado] = await pool.query(updateQuery, [updateValues.fecha_inicio, updateValues.fecha_fin, updateValues.fk_id_usuario, updateValues.fk_id_actividad, updateValues.fk_id_variedad, parseInt(id_programacion)]);
  
      if (resultado.affectedRows > 0) {
        res.status(200).json({ "mensaje": "La programación ha sido actualizada" });
      } else {
        res.status(404).json({ "mensaje": "No se pudo actualizar la programación" });
      }
    } catch (error) {
      res.status(500).json({ "mensaje": error.message });
    }
  };
  

export const desactivar = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const [oldRecurso] = await pool.query("SELECT * FROM programacion WHERE id_programacion = ?", [id]);

        const [result] = await pool.query(
            `UPDATE programacion SET estado = ${estado ? `'${estado}'` : `'${oldRecurso[0].estado}'`} WHERE id_programacion = ?`, [id]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                message: 'Se cambio el estado correctamente',
                result: result
            });
        } else {
            res.status(404).json({
                status: 404,
                message: 'No se pudo cambiar el estado'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error en el sistema"
        });
    }
}

// CRUD -buscar
export const buscarProgramacion = async (req, res) => {
    try {
        const { nombre } = req.params;
        const query = `
            SELECT p.*, u.nombre AS nombre_usuario, a.nombre_actividad, v.nombre_variedad
            FROM programacion p
            INNER JOIN usuarios u ON p.fk_id_usuario = u.id_usuario
            INNER JOIN actividad a ON p.fk_id_actividad = a.id_actividad
            INNER JOIN variedad v ON p.fk_id_variedad = v.id_variedad
            WHERE a.nombre_actividad LIKE ?`;
        const [result] = await pool.query(query, [`%${nombre}%`]);
                    
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                status: 404,
                message: 'No se encontraron resultados para la búsqueda'
            });
        }

    } catch (error) {
        console.error('Error en buscarProgramacion:', error);
        res.status(500).json({
            status: 500,
            message: "Error en el sistema"
        });
    }
};



export const desactivarProgamacionCadena = async (req, res) => {
    try {
        const { id } = req.params;

        // Llamar al procedimiento almacenado
        await pool.query('CALL administrar_programacion(?)', [id]);

        res.status(200).json({
            status: 200,
            message: 'Se cambió el estado de la programación y todos sus registros relacionados con éxito',
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error al cambiar el estado de la programación y sus registros relacionados',
            error: error.message
        });
    }
};


// pablo Andres perdomo mancera

export const listarProgramacionPorUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        const sql = `
            SELECT 
                p.id_programacion,
                p.fecha_inicio,
                p.fecha_fin,
                u.nombre AS nombre_usuario, 
                a.nombre_actividad,
                v.nombre_variedad AS nombre_variedad,
                p.estado
            FROM 
                programacion AS p
            JOIN 
                usuarios AS u ON p.fk_id_usuario = u.id_usuario
            JOIN 
                actividad AS a ON p.fk_id_actividad = a.id_actividad
            JOIN 
                variedad AS v ON p.fk_id_variedad = v.id_variedad
            WHERE 
                p.fk_id_usuario = ?`;

        const [result] = await pool.query(sql, [id_usuario]);

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                status: 404,
                message: 'No hay programaciones para este usuario'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Error interno del servidor'
        });
    }
};

export const BuscaActividadId = async (req, res) => {
    const { idActividad } = req.params;
    try {
        // Consulta SQL para buscar la actividad por su ID
        const sql = `
            SELECT 
                p.id_programacion,
                p.fecha_inicio,
                p.fecha_fin,
                u.nombre AS nombre_usuario, 
                a.nombre_actividad,
                v.nombre_variedad AS nombre_variedad,
                p.estado
            FROM 
                programacion AS p
            JOIN 
                usuarios AS u ON p.fk_id_usuario = u.id_usuario
            JOIN 
                actividad AS a ON p.fk_id_actividad = a.id_actividad
            JOIN 
                variedad AS v ON p.fk_id_variedad = v.id_variedad
            WHERE 
                p.id_programacion = ?`;

        const [result] = await pool.query(sql, [idActividad]);

        if (result.length > 0) {
            res.status(200).json(result[0]); // Devuelve el primer resultado encontrado
        } else {
            res.status(404).json({ message: 'Actividad no encontrada' });
        }
    } catch (error) {
        console.error('Error al buscar actividad por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
