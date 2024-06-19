import {query} from 'express';
import { pool } from '../database/conexion.js';
import { validationResult } from 'express-validator';

export const listar = async (req, res) => {
    try {
        let sql = `SELECT cul.id_cultivo,
        cul.fecha_inicio,
        fin.nombre_finca,
        lo.nombre AS nombre_lote,
        cul.cantidad_sembrada,
        var.nombre_variedad,
        cul.estado
 FROM cultivo AS cul
 JOIN lotes AS lo ON cul.fk_id_lote = lo.id_lote
 JOIN finca AS fin ON lo.fk_id_finca = fin.id_finca
 JOIN variedad AS var ON cul.fk_id_variedad = var.id_variedad;
 `;
        const [result] = await pool.query(sql);
        
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({'message': 'No se encontraron cultivos'});
        }
    } catch(error) {
        res.status(500).json({'status': 500, 'message': 'Error en el sistema: ' + error});
    }
};
  
export const registrar = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors })
        }
        const { fecha_inicio, cantidad_sembrada, fk_id_lote, fk_id_variedad } = req.body
        const [resultado] = await pool.query("insert into cultivo(fecha_inicio, cantidad_sembrada, fk_id_lote, fk_id_variedad) values (?,?,?,?)", [fecha_inicio, cantidad_sembrada, fk_id_lote, fk_id_variedad])

        if (resultado.affectedRows > 0) {
            res.status(200).json({
                "mensaje": "cultivo registrado con exito"
            })
        } else {
            res.status(400).json({
                "mensaje": "Fallo el registro de su cultivo"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error en el sistema: ' + error
        })
    }
}
  
  
export const actualizar = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // Corrección en el formato de los errores de validación
        }
        
        const { id_cultivo } = req.params;
        const { fecha_inicio, cantidad_sembrada, fk_id_lote, fk_id_variedad } = req.body;
        
        // Verifica si al menos uno de los campos está presente en la solicitud
        if (!fecha_inicio && !cantidad_sembrada && !fk_id_lote && !fk_id_variedad) {
            return res.status(400).json({ message: 'Al menos uno de los campos (fecha_inicio, cantidad_sembrada, fk_id_lote, fk_id_variedad) debe estar presente en la solicitud para realizar la actualización.' });
        }
        
        const [oldUser] = await pool.query("SELECT * FROM cultivo WHERE id_cultivo=?", [id_cultivo]);
        
        const updateValues = {
            fecha_inicio: fecha_inicio ? fecha_inicio : oldUser[0].fecha_inicio,
            cantidad_sembrada: cantidad_sembrada ? cantidad_sembrada : oldUser[0].cantidad_sembrada,
            fk_id_lote: fk_id_lote ? fk_id_lote : oldUser[0].fk_id_lote,
            fk_id_variedad: fk_id_variedad ? fk_id_variedad : oldUser[0].fk_id_variedad,
        };
        
        const updateQuery = `UPDATE cultivo SET fecha_inicio=?, cantidad_sembrada=?, fk_id_lote=?, fk_id_variedad=? WHERE id_cultivo=?`;
        
        const [resultado] = await pool.query(updateQuery, [updateValues.fecha_inicio, updateValues.cantidad_sembrada, updateValues.fk_id_lote, updateValues.fk_id_variedad, parseInt(id_cultivo)]);
        
        if (resultado.affectedRows > 0) { 
            res.status(200).json({ "mensaje": "El cultivo ha sido actualizado" });
        } else {
            res.status(404).json({ "mensaje": "No se pudo actualizar el cultivo" }); 
        }
    } catch (error) {
        res.status(500).json({ message: 'Error en el sistema: ' + error }); // Corrección en el manejo de error
    }
}


  
export const buscar = async (req, res) => {
    try {
        const { nombre } = req.params; // Obtener el nombre de la variedad desde los parámetros
        const searchTerm = `%${nombre}%`; // Cambio aquí: preparar el término de búsqueda para buscar coincidencias parciales
        const consultar = `
            SELECT cul.id_cultivo,
                   cul.fecha_inicio,
                   cul.cantidad_sembrada, 
                   lo.nombre AS nombre_lote, 
                   fin.nombre_finca,
                   var.nombre_variedad, 
                   cul.estado
            FROM cultivo AS cul
            JOIN lotes AS lo ON cul.fk_id_lote = lo.id_lote
            JOIN finca AS fin ON lo.fk_id_finca = fin.id_finca
            JOIN variedad AS var ON cul.fk_id_variedad = var.id_variedad
            WHERE var.nombre_variedad LIKE ?`; // Cambio aquí: utilizar el operador LIKE para buscar coincidencias parciales
        const [resultado] = await pool.query(consultar, [searchTerm]); // Pasar el término de búsqueda como parámetro

        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(404).json({
                mensaje: "No se encontró ningún cultivo con ese nombre de variedad"
            });
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error en el sistema: ' + error });
    }
};




export const desactivar = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const [oldRecurso] = await pool.query("SELECT * FROM cultivo WHERE id_cultivo = ?", [id]); 
        
        const [result] = await pool.query(
            `UPDATE cultivo SET estado = ${estado ? `'${estado}'` : `'${oldRecurso[0].estado}'`} WHERE id_cultivo = ?`,[id]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                message: 'El estado del cultivo ha sido cambiado exitosamente',
                result: result
            });
        } else {
            res.status(404).json({
                status: 404,
                message: 'No se pudo cambiar el estado del cultivo'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error en el sistema: ' + error
        });
    }
}




export const desactivarCultivo = async (req, res) => {
    try {
        const { id } = req.params;

        // Llamar al procedimiento almacenado
        await pool.query('CALL administrar_cultivo(?)', [id]);

        res.status(200).json({
            status: 200,
            message: 'Se cambió el estado del cultivo y todas sus variedades con éxito',
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error al cambiar el estado del cultivo y sus variedades',
            error: error.message
        });
    }
};
