import joi from "joi";
import { generalFields } from "../../middleware/validation.js";



export const creatCategorySchema = joi.object({
    name:joi.string().required().max(15).min(3),
    file:generalFields.file.required(),
    // file:joi.array().items(generalFields.file.required()).required(),
}).required()


export const updateCategorySchema = joi.object({
    name:joi.string().optional().max(15).min(3),
    file:generalFields.file.optional(),
    categoryId:joi.string()
    // file:joi.array().items(generalFields.file.required()).required(),
}).required()