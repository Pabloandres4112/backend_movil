import { check } from "express-validator"


export const validarlotes=[
            
check('nombres','es obligatorio').isEmpty().isLength({max:100}),
check('longitud','es obligatorio') .isFloat({ min: -180, max: 180 }),
check('latitud','es obligatorio') .isFloat({ min: -80, max: 90 }),
check('fk_id_finca','es obligartorio el fk_id_finca').isInt()
];
//nn

export const validarlotesactualizar=[
            
    check('nombres','es obligatorio').isEmpty().isLength({max:100}) .optional(),
    check('longitud','es obligatorio') .isFloat({ min: -180, max: 180 }) .optional(),
    check('latitud','es obligatorio') .isFloat({ min: -80, max: 90 }) .optional(),
    check('fk_id_finca','es obligartorio el fk_id_finca').isInt() .optional(),
    ]
    