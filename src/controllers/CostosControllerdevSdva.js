import {query} from 'express';
import { pool } from '../database/conexion.js';
import { validationResult } from 'express-validator';

export const listar = async (req,res) => {
    try{
      let sql = `SELECT cos.id_costos, cos.precio, 
                      ac.nombre_actividad, ac.tiempo,ac.observaciones,ac.valor_actividad,
                      tr.nombre_recursos, tr.cantidad_medida,tr.unidades_medida,tr.extras
               FROM costos AS cos
               JOIN actividad AS ac ON cos.fk_id_actividad = ac.id_actividad
               JOIN tipo_recursos AS tr ON cos.fk_id_tipo_recursos = tr.id_tipo_recursos;`;

    const [result] = await pool.query(sql);
    if (result.length > 0) {
      res.status(200).json(result);
    }else{
      res.status(404).json({'message': 'No se encontraron costos '});
    }
  } catch(error){
    res.status(500).json({'status':500,'message':'error en el sistema: '+error});
  }
  };
  
  export const registrar = async (req, res) =>{
    try{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
    const {fk_id_tipo_recursos, fk_id_actividad, precio} = req.body;
  
    let checkSql = `SELECT COUNT(*) AS count FROM tipo_recursos WHERE id_tipo_recursos = ?`;
    let checkSql2 = `SELECT COUNT(*) AS count FROM actividad WHERE id_actividad = ?`;
    const [checkResult] = await pool.query(checkSql, [fk_id_tipo_recursos]);
    const [checkResult2] = await pool.query(checkSql2, [fk_id_actividad]);
    if (checkResult[0].count === 0) {
      return res.status(400).json({ status: 400, message: 'El valor de fk_id_tipo_recursos no existe en la tabla tipo_recursos' });
    }
    if (checkResult2[0].count === 0) {
      return res.status(400).json({ status: 400, message: 'El valor de fk_id_actividad no existe en la tabla actividad' });
    }

    let sql =  `INSERT INTO costos (fk_id_tipo_recursos, fk_id_actividad, precio) VALUES (?, ?, ?)`;
  
    const [rows] = await pool.query(sql,[fk_id_tipo_recursos, fk_id_actividad, precio]);
    if (rows.affectedRows > 0) {
      res.status(200).json({'status':200,'message':'Registro exitoso de sus costos'});
    }else{
      res.status(403).json({'status':403,'message':'Fallo el registro de sus costos'});
    }
  } catch(error){
    res.status(500).json({'status':500,'message':'error en el sistema: '+error});
  }
  
  };
  
  

  export const actualizar = async (req, res) => {
    try {
       const { id_costos } = req.params;
       const { precio, fk_id_actividad, fk_id_tipo_recursos } = req.body;

       if (!precio && !fk_id_actividad && !fk_id_actividad ) {
        return res.status(400).json({ message: 'Al menos uno de los campos (precio, fk_id_actividad, fk_id_tipo_recursos) debe estar presente en la solicitud para realizar la actualización.' });
    }
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
           return res.status(400).json({ errors: errors.array() });
       }
   
       // Verificar si el valor de fk_id_tipo_recursos existe en la tabla tipo_recursos
       let checkSql = `SELECT COUNT(*) AS count FROM tipo_recursos WHERE id_tipo_recursos = ?`;
       let checkSql2 = `SELECT COUNT(*) AS count FROM actividad WHERE id_actividad = ?`;
       const [checkResult] = await pool.query(checkSql, [fk_id_tipo_recursos]);
       const [checkResult2] = await pool.query(checkSql2, [fk_id_actividad]);
   
       if (checkResult[0].count === 0) {
         return res.status(400).json({ status: 400, message: 'El valor de fk_id_tipo_recursos no existe en la tabla tipo_recursos' });
       }
       if (checkResult2[0].count === 0) {
        return res.status(400).json({ status: 400, message: 'El valor de fk_id_actividad no existe en la tabla actividad' });
      }

      const [costosExist] = await pool.query('SELECT * FROM costos WHERE id_costos = ?', [fk_id_tipo_recursos, fk_id_actividad]);

      if (costosExist.length === 0) {
          return res.status(404).json({
              status: 404,
              message: 'El costo no existe. Registre primero un costo.'
          });
      }
   
       let sql = `
         UPDATE costos
         SET fk_id_tipo_recursos = ?,
             fk_id_actividad = ?,
             precio = ?
         WHERE id_costos = ?
       `;
   
       const [rows] = await pool.query(sql, [fk_id_tipo_recursos, fk_id_actividad, precio, id_costos]);
   
       if (rows.affectedRows > 0) {
         res.status(200).json({ status: 200, message: 'La información ha sido actualizada' });
       } else {
         res.status(404).json({ status: 404, message: 'No se pudo actualizar la información' });
       }
    } catch (error) {
       res.status(500).json({ status: 500, message: 'Error en el sistema: ' + error });
    }
   };
  
   export const buscar = async (req, res) => {
    try {
        const { id_costos } = req.params;
        
        // Consulta SQL corregida para incluir las tablas relacionadas
        let sql = `SELECT cos.id_costos, cos.precio, 
            ac.nombre_actividad, ac.tiempo, ac.observaciones, ac.valor_actividad,
            tr.nombre_recursos, tr.cantidad_medida, tr.unidades_medida, tr.extras
            FROM costos AS cos
            JOIN actividad AS ac ON cos.fk_id_actividad = ac.id_actividad
            JOIN tipo_recursos AS tr ON cos.fk_id_tipo_recursos = tr.id_tipo_recursos
            WHERE cos.id_costos = ?`;
        
        const [resultado] = await pool.query(sql, [id_costos]);

        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(404).json({
                mensaje: "No se encontró un recurso con ese ID"
            });
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error en el sistema: ' + error });
    }
};
