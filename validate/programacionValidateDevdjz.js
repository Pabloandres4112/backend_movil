import { check } from "express-validator";

// Registrar Asignación
export const programacionC = [
    check('fk_id_usuario').notEmpty().withMessage().isNumeric().withMessage(),
    check('fk_id_variedad').notEmpty().withMessage().isNumeric().withMessage(),
    check('fk_id_actividad').notEmpty().withMessage().isNumeric().withMessage(),
    check('fecha_inicio').notEmpty().withMessage('La  es fecha es obligatoria').isISO8601().withMessage('La fecha debe estar en formato ISO 8601 (YYYY-MM-DD)'),
    check('fecha_fin').notEmpty().withMessage('La  es fecha es obligatoria').isISO8601().withMessage('La fecha debe estar en formato ISO 8601 (YYYY-MM-DD)')

];

// Actualizar Asignación
export const programacionA = [
    check('fk_id_usuario').optional().isNumeric().withMessage(),
    check('fk_id_variedad').optional().isNumeric().withMessage(),
    check('fk_id_actividad').optional().isNumeric().withMessage(),
    check('fecha_inicio').optional().isISO8601().withMessage('La fecha debe estar en formato ISO 8601 (YYYY-MM-DD)'),
    check('fecha_fin').optional().isISO8601().withMessage('La fecha debe estar en formato ISO 8601 (YYYY-MM-DD)')

];
