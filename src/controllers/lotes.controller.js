import { pool } from "../database/conexion.js"
import { validationResult } from 'express-validator'

export const listarlotes = async (req, res) => {
    try {
        let sql = `SELECT lo.id_lote, lo.nombre, lo.longitud, lo.latitud, 
                          lo.fk_id_finca AS id_finca,  
                          fin.nombre_finca,
                          lo.*
                   FROM lotes AS lo
                   JOIN finca AS fin ON lo.fk_id_finca = fin.id_finca`;
        const [resultado] = await pool.query(sql)

        if (resultado.length > 0) {
            res.status(200).json(resultado)
        } else {
            res.status(404).json({
                "mensaje": "No se pudo mostrar, hay algún error."
            })
        }
    } catch (error) {
        res.status(500).json({
            "mensaje": error
        })
    }
}



export const Registrarlotes = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors })
        }
        const { nombre, longitud, latitud, fk_id_finca } = req.body
        const [resultado] = await pool.query("insert into lotes(nombre, longitud, latitud, fk_id_finca) values (?,?,?,?)", [nombre, longitud, latitud, fk_id_finca])

        if (resultado.affectedRows > 0) {
            res.status(200).json({
                "mensaje": "Lote registrado con exito"
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

export const Actualizarlote = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // Corrección en el formato de los errores de validación
        }

        const { id_lote } = req.params;
        const { nombre, longitud, latitud, fk_id_finca } = req.body;

        // Verifica si al menos uno de los campos está presente en la solicitud
        if (!nombre && !longitud && !latitud && !fk_id_finca) {
            return res.status(400).json({ message: 'Al menos uno de los campos (nombre, longitud, latitud, fk_id_finca) debe estar presente en la solicitud para realizar la actualización.' });
        }

        const [oldUser] = await pool.query("SELECT * FROM lotes WHERE id_lote=?", [id_lote]);

        const updateValues = {
            nombre: nombre ? nombre : oldUser[0].nombre,
            longitud: longitud ? longitud : oldUser[0].longitud,
            latitud: latitud ? latitud : oldUser[0].latitud,
            fk_id_finca: fk_id_finca ? fk_id_finca : oldUser[0].fk_id_finca,
        };

        const updateQuery = `UPDATE lotes SET nombre=?, longitud=?, latitud=?, fk_id_finca=? WHERE id_lote=?`;

        const [resultado] = await pool.query(updateQuery, [updateValues.nombre, updateValues.longitud, updateValues.latitud, updateValues.fk_id_finca, parseInt(id_lote)]);

        if (resultado.affectedRows > 0) {
            res.status(200).json({ "mensaje": "El lote ha sido actualizado" });
        } else {
            res.status(404).json({ "mensaje": "No se pudo actualizar el lote" });
        }
    } catch (error) {
        res.status(500).json({ "mensaje": error.message });
    }
}




export const Buscarlote = async (req, res) => {
    try {
        const { nombre } = req.params;
        const query = `
            SELECT lotes.*, finca.nombre_finca AS nombre_finca 
            FROM lotes 
            INNER JOIN finca ON lotes.fk_id_finca = finca.id_finca 
            WHERE lotes.nombre LIKE ? OR finca.nombre_finca LIKE ?
        `;
        const [result] = await pool.query(query, [`%${nombre}%`, `%${nombre}%`]);

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



//CRUD - Desactivar
export const DesactivarLote = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const [oldRecurso] = await pool.query("SELECT * FROM lotes WHERE id_lote = ?", [id]);

        const [result] = await pool.query(
            `UPDATE lotes SET estado = ${estado ? `'${estado}'` : `'${oldRecurso[0].estado}'`} WHERE id_lote = ?`, [id]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                message: 'Se cambio el estado del lote exitosamente',
                result: result
            });
        } else {
            res.status(404).json({
                status: 404,
                message: 'No se pudo cambiar el estado del lote'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error
        });
    }
}
/* 
export const desactivarlote = async (req, res) => {
    try {
        const { id_lote } = req.params;
        const [result] = await pool.query("UPDATE lotes SET estado='inactivo' WHERE id_lote=?", [id_lote]);
        
        if (result.affectedRows >  0) {
            res.status(200).json({
                status: 200,
                "mensaje": "El lote con el id "+id_lote+" ha sido desactivado."
            });
        } else {
            res.status(404).json({
                status: 404,
                "message": "No se pudo desactivar el lote"
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error en el sistema: '+error
        });
    }
} */

