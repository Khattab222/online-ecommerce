
import  joi  from 'joi';
import { generalFields } from './../../middleware/validation.js';


export const creatOrder = joi.object({
 
    address:joi.string().required(),
    phone:joi.array().items(
        joi.string().regex(/^(002|\+02)01?[0125][0-9]{8}$/).required()
    ).required(),
    couponCode:joi.string().optional(),
    products:joi.array().items(
        joi.object({
            productId:generalFields.id,
            quantity:joi.number().integer().positive().required()
        }).required()
    ),
    paymentMethod:joi.string().valid('cash','card').required()
}).required()



export const cancelOrder = joi.object({

    reason: joi.string().required(),
    orderId: generalFields.id,

}).required()