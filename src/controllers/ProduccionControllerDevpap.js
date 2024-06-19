import { pool } from "../database/conexion.js";
import { validationResult } from "express-validator";

export const listarProduccion = async (req, res) => {
    try {
        let sql = `SELECT 
            produ.id_producccion,
            produ.cantidad_produccion,
            produ.precio,
            act.nombre_actividad AS nombre_actividad
        FROM produccion AS produ
        JOIN actividad AS act ON produ.fk_id_actividad = act.id_actividad`;


        const [listar] = await pool.query(sql);

        if (listar.length > 0) {
            res.status(200).json(listar);
        } else {
            res.status(400).json({
                status: 400,
                message: 'No hay ninguna producción'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error en el sistema',
        });
        console.log(error);
    }
};

export const registrarProduccion = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors });
        }

        const { cantidad_produccion, precio, fk_id_actividad } = req.body
        const [resultado] = await pool.query("insert into produccion(cantidad_produccion, precio, fk_id_actividad) values (?,?,?)", [cantidad_produccion, precio, fk_id_actividad])

        if (resultado.affectedRows > 0) {
            res.status(200).json({
                "mensaje": "Producción registrada con exito"
            })
        } else {
            res.status(400).json({
                "mensaje": "hay un error no se pudo guardar"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error en el sistema',
        })
    }
}


export const BuscarProduccion = async (req, res) => {
    try {
        const { nombre } = req.params; // Obtener el nombre de la variedad desde los parámetros
        const searchTerm = `%${nombre}%`; // Cambio aquí: preparar el término de búsqueda para buscar coincidencias parciales
        const consultar = `
        SELECT cul.id_producccion,
       cul.cantidad_produccion,
       cul.precio, 
       lo.nombre_actividad AS nombre_actividad
FROM produccion AS cul
JOIN actividad AS lo ON cul.fk_id_actividad = lo.id_actividad
WHERE lo.nombre_actividad LIKE ?;
`; // Cambio aquí: utilizar el operador LIKE para buscar coincidencias parciales
        const [resultado] = await pool.query(consultar, [searchTerm]); // Pasar el término de búsqueda como parámetro

        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(404).json({
                mensaje: "No se encontró ninguna producción con ese nombre de actividad"
            });
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error en el sistema: ' + error });
    }
};





//actualizar
export const actualizarProduccion = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }

        const { id_producccion } = req.params;
        const { cantidad_produccion, precio, fk_id_actividad } = req.body;

        // Verifica si al menos uno de los campos está presente en la solicitud
        if (!cantidad_produccion && !precio && !fk_id_actividad) {
            return res.status(400).json({ message: 'Al menos uno de los campos ( cantidad_produccion, precio, fk_id_actividad) debe estar presente en la solicitud para realizar la actualización.' });
        }

        console.log("Consulta SQL:", `SELECT * FROM produccion WHERE id_producccion=${id_producccion}`);

        const [oldFinca] = await pool.query("SELECT * FROM produccion WHERE id_producccion=?", [id_producccion]);

        const [result] = await pool.query(
            `UPDATE produccion SET cantidad_produccion = ${cantidad_produccion ? `'${cantidad_produccion}'` : `'${oldFinca[0].cantidad_produccion}'`}, precio = ${precio ? `'${precio}'` : `'${oldFinca[0].precio}'`}, fk_id_actividad = ${fk_id_actividad ? `'${fk_id_actividad}'` : `'${oldFinca[0].fk_id_actividad}'`} WHERE id_producccion = ?`,
            [id_producccion]
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

