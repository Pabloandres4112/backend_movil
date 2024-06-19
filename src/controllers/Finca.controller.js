import { pool } from "../database/conexion.js";
import { validationResult } from 'express-validator';

export const listarFinca = async (req, res) => {
    try {
        
        const [result] = await pool.query("SELECT * FROM finca")

        if (result.length > 0 ) {
            res.status(200).json(result)
        } else {
            res.status(400).json({
                "Mensaje":"No se encontraron fincas"
            })
        }
    } catch (error) {
        res.status(500).json({
            "Mensaje": "error en el sistema"
        })
    }
}
//crud Registrar
export const RegistroFinca = async (req, res) => {
    try {
            const errors= validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json(errors);
            }
           
        const { nombre_finca, longitud, latitud } = req.body;


        const [result] = await pool.query("INSERT INTO finca (nombre_finca, longitud, latitud) VALUES (?, ?, ?)", [nombre_finca, longitud, latitud]);
        
        if (result.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                message: 'Se registró la finca con éxito',
                result: result
            });
        } else {
            res.status(403).json({
                status: 403,
                message: 'No se registró la finca',
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message || 'error en el sistema'
        });
    }
}

//actualizar
export const ActualizarFinca = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }

        const { id } = req.params;
        const { nombre_finca, longitud, latitud } = req.body;

        // Verifica si al menos uno de los campos está presente en la solicitud
        if (!nombre_finca && !longitud && !latitud) {
            return res.status(400).json({ message: 'Al menos uno de los campos (nombre_finca, longitud, latitud) debe estar presente en la solicitud para realizar la actualización.' });
        }

        console.log("Consulta SQL:", `SELECT * FROM finca WHERE id_finca=${id}`);

        const [oldFinca] = await pool.query("SELECT * FROM finca WHERE id_finca=?", [id]);

        const [result] = await pool.query(
            `UPDATE finca SET nombre_finca = ${nombre_finca ? `'${nombre_finca}'` : `'${oldFinca[0].nombre_finca}'`}, longitud = ${longitud ? `'${longitud}'` : `'${oldFinca[0].longitud}'`}, latitud = ${latitud ? `'${latitud}'` : `'${oldFinca[0].latitud}'`} WHERE id_finca = ?`,
            [id]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: 200,
                message: 'Se actualizó con éxito',
                result: result
            });
        } else {
            return res.status(404).json({
                status: 404,
                message: 'No se encontró el registro para actualizar'
            });
        }
    } catch (error) {
        console.error("Error en la función Actualizar:", error);  
        return res.status(500).json({
            status: 500,
            message: error.message || "error en el sistema"
        });
    }
};

// CRUD - Buscar
// En el controlador de Finca, crea una nueva función de búsqueda por nombre
export const BuscarFinca = async (req, res) => {
    try {
        const { nombre } = req.params;
        const [result] = await pool.query("SELECT * FROM finca WHERE nombre_finca LIKE ?", [`%${nombre}%`]);
                    
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
export const DesactivarFinca = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const [oldRecurso] = await pool.query("SELECT * FROM finca WHERE id_finca = ?", [id]); 
        
        const [result] = await pool.query(
            `UPDATE finca SET estado = ${estado ? `'${estado}'` : `'${oldRecurso[0].estado}'`} WHERE id_finca = ?`,[id]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                message: 'El estado de la finca ha sido cambiado exitosamente',
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
            message: "error en el sistema"
        });
    }
}





export const DesactivarFincaencadena = async (req, res) => {
    try {
        const { id } = req.params;

        // Llamar al procedimiento almacenado para administrar la finca
        await pool.query('CALL administrar_finca(?)', [id]);

        res.status(200).json({
            status: 200,
            message: 'Se realizó la acción sobre la finca y sus registros relacionados con éxito',
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error al realizar la acción sobre la finca y sus registros relacionados',
            error: error.message
        });
    }
};

/**
 * DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `administrar_finca`(IN `id_finca_param` INT)
BEGIN
    DECLARE finca_estado VARCHAR(10);

    -- Obtener el estado actual de la finca
    SELECT estado INTO finca_estado FROM finca WHERE id_finca = id_finca_param;

    -- Si la finca está activa, desactivar todos los registros relacionados
    IF finca_estado = 'activo' THEN
        UPDATE lotes SET estado = 'inactivo' WHERE fk_id_finca = id_finca_param;
        UPDATE cultivo SET estado = 'inactivo' WHERE fk_id_lote IN (SELECT id_lote FROM lotes WHERE fk_id_finca = id_finca_param);
        UPDATE programacion SET estado = 'inactivo' WHERE fk_id_cultivo IN (SELECT id_cultivo FROM cultivo WHERE fk_id_lote IN (SELECT id_lote FROM lotes WHERE fk_id_finca = id_finca_param));
        UPDATE finca SET estado = 'inactivo' WHERE id_finca = id_finca_param;
    -- Si la finca está inactiva, activar todos los registros relacionados
    ELSE
        UPDATE lotes SET estado = 'activo' WHERE fk_id_finca = id_finca_param;
        UPDATE cultivo SET estado = 'activo' WHERE fk_id_lote IN (SELECT id_lote FROM lotes WHERE fk_id_finca = id_finca_param);
        UPDATE programacion SET estado = 'activo' WHERE fk_id_cultivo IN (SELECT id_cultivo FROM cultivo WHERE fk_id_lote IN (SELECT id_lote FROM lotes WHERE fk_id_finca = id_finca_param));
        UPDATE finca SET estado = 'activo' WHERE id_finca = id_finca_param;
    END IF;
END$$
DELIMITER ;
 */