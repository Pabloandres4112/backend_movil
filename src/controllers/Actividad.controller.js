import { pool } from "../database/conexion.js";
import { validationResult } from 'express-validator';

//crud listar
//listar
export const listarA = async (req, res) => {
    try {
        let sql = `SELECT ac.id_actividad, 
                            ac.nombre_actividad, 
                            ac.tiempo, 
                            ac.observaciones,
                            ac.valor_actividad, 
                            ac.fk_id_variedad AS id_variedad, 
                            v.nombre_variedad,
                            ac.estado
                    FROM actividad AS ac 
                    JOIN variedad AS v ON ac.fk_id_variedad = v.id_variedad`;   
        const [result] = await pool.query(sql);

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(400).json({
                "Mensaje": "No hay actividades que listar"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            "Mensaje": "Error en el sistema"
        });
    }
};

export const RegistrarA = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors })
        }
        const { nombre_actividad, tiempo, observaciones, valor_actividad, fk_id_variedad ,fk_id_usuario } = req.body
        const [resultado] = await pool.query("insert into actividad(nombre_actividad, tiempo, observaciones, valor_actividad, fk_id_variedad,fk_id_usuario ) values (?,?,?,?,?,?)", [nombre_actividad, tiempo, observaciones, valor_actividad, fk_id_variedad,fk_id_usuario])

        if (resultado.affectedRows > 0) {
            res.status(200).json({
                "mensaje": "Actividad registrada con exito"
            })
        } else {
            res.status(400).json({
                "mensaje": "hay un error no se pudo guardar"
            })
        }
    } catch (error) {
        res.status(500).json({
            "mensaje": error
        })
    }
}


export const ActualizarA = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id_actividad } = req.params; // Asegúrate de usar id_programacion aquí
        const { nombre_actividad, tiempo, observaciones, valor_actividad, fk_id_variedad , fk_id_usuario } = req.body;

        if (!nombre_actividad && !tiempo && !observaciones && !valor_actividad && !fk_id_variedad ,!fk_id_usuario) {
            return res.status(400).json({ message: 'Al menos uno de los campos (nombre_actividad, tiempo, observaciones, valor_actividad, fk_id_variedad , fk_id_usuario) debe estar presente en la solicitud para realizar la actualización.' });
        }

        const [oldUser] = await pool.query("SELECT * FROM actividad WHERE id_actividad=?", [id_actividad]);

        const updateValues = {
            nombre_actividad: nombre_actividad ? nombre_actividad : oldUser[0].nombre_actividad,
            tiempo: tiempo ? tiempo : oldUser[0].tiempo,
            observaciones: observaciones ? observaciones : oldUser[0].observaciones,
            valor_actividad: valor_actividad ? valor_actividad : oldUser[0].valor_actividad,
            fk_id_variedad: fk_id_variedad ? fk_id_variedad : oldUser[0].fk_id_variedad,
            fk_id_usuario: fk_id_usuario ? fk_id_usuario : oldUser[0].fk_id_usuario
        };

        const updateQuery = `UPDATE actividad SET nombre_actividad=?, tiempo=?, observaciones=?, valor_actividad=?, fk_id_usuario=?, fk_id_variedad=? WHERE id_actividad=?`;

        const [resultado] = await pool.query(updateQuery, [updateValues.nombre_actividad, updateValues.tiempo, updateValues.observaciones, updateValues.valor_actividad, updateValues.fk_id_variedad, updateValues.fk_id_usuario, parseInt(id_actividad)]);

        if (resultado.affectedRows > 0) {
            res.status(200).json({ "mensaje": "La actividad ha sido actualizada" });
        } else {
            res.status(404).json({ "mensaje": "No se pudo actualizar la actividad" });
        }
    } catch (error) {
        res.status(500).json({ "mensaje": error.message });
    }
};


export const DesactivarA = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const [oldRecurso] = await pool.query("SELECT * FROM actividad WHERE id_actividad = ?", [id]);

        const [result] = await pool.query(
            `UPDATE actividad SET estado = ${estado ? `'${estado}'` : `'${oldRecurso[0].estado}'`} WHERE id_actividad = ?`, [id]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                message: 'Se cambio el estado con éxito',
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
            message: error
        });
    }
}



// CRUD - Buscar
export const BuscarA = async (req, res) => {
    try {
        const { nombre } = req.params;
        const query = `
            SELECT a.*, v.nombre_variedad
            FROM actividad a
            INNER JOIN variedad v ON a.fk_id_variedad = v.id_variedad
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
        res.status(500).json({
            status: 500,
            message: "error en el sistema"
        });
    }
};



export const BuscarPorUsuarioMovil = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        // Consulta SQL para obtener las actividades del usuario especificado
        const sql = `
            SELECT 
                ac.id_actividad, 
                ac.nombre_actividad, 
                ac.tiempo, 
                ac.observaciones,
                ac.valor_actividad, 
                ac.fk_id_variedad AS id_variedad, 
                v.nombre_variedad,
                ac.estado
            FROM actividad AS ac 
            JOIN variedad AS v ON ac.fk_id_variedad = v.id_variedad
            WHERE ac.fk_id_usuario = ?`;

        // Ejecutar la consulta SQL con el parámetro fk_id_usuario
        const [result] = await pool.query(sql, [id_usuario]);

        // Comprobar si se encontraron actividades
        if (result.length > 0) {
            res.status(200).json(result); // Devolver las actividades encontradas en formato JSON
        } else {
            res.status(404).json({ mensaje: 'No se encontraron actividades para el usuario especificado.' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};
export const BuscaUnaACtividad = async (req, res) => {
    try {
        const { id_actividad } = req.params;

        // Consulta SQL para obtener las actividades del usuario especificado
        const sql = `
      SELECT 
       ac.id_actividad, 
            ac.nombre_actividad, 
                            ac.tiempo, 
                            ac.observaciones,
                            ac.valor_actividad, 
                            ac.fk_id_variedad AS id_variedad, 
                            v.nombre_variedad,
                            ac.estado
                    FROM actividad AS ac 
                    JOIN variedad AS v ON ac.fk_id_variedad = v.id_variedad
      WHERE ac.id_actividad = ?`;

        // Ejecutar la consulta SQL con el parámetro id_actividad
        const [result] = await pool.query(sql, [id_actividad]);

        // Comprobar si se encontraron actividades
        if (result.length > 0) {
            res.status(200).json(result); // Devolver las actividades encontradas en formato JSON
        } else {
            res.status(404).json({ mensaje: 'No se encontraron actividades para el usuario especificado.' });
        }
    } catch (error) {
        res.status(500).json({ "mensaje": error.message });
    }
}