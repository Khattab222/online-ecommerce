
import  joi  from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const creatCouponSchema = joi.object({
    code:joi.string().min(2).max(15).required(),
    amount:joi.number().required(),
    fromDate:joi.date().greater(Date.now()).required(),
    toDate:joi.date().greater(Date.now()).required(),
    // toDate:joi.string().optional(),
    usagePerUser:joi.array().items(joi.object({
        userId:generalFields.id,
        maxUsage:joi.number().positive().required()
    }).required()).required()
   
}).required()





export const updateCouponSchema = joi.object({
    code:joi.string().min(2).max(15).optional(),
    amount:joi.number().optional(),
    fromDate:joi.string().optional(),
    toDate:joi.string().optional(),
    couponId:generalFields.id.required()
}).required()