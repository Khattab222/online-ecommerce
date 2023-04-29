
import  joi  from 'joi';
import { generalFields } from '../../middleware/validation.js';


export const signup = joi.object({
    userName:joi.string().min(4).max(10).required().alphanum(),
    email:generalFields.email,
    password:generalFields.password,
    cPass:generalFields.cPassword,
    DOB:joi.number().required(),
    phone:joi.string().optional()
}).required()
