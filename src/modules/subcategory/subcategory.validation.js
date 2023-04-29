import joi from "joi";
import { generalFields } from "../../middleware/validation.js";



export const creatsubCategorySchema = joi.object({
    name:joi.string().required().max(15).min(3),
    file:generalFields.file.required(),
    categoryId:joi.string().required(),
    // file:joi.array().items(generalFields.file.required()).required(),
}).required()


export const updateSubCategorySchema = joi.object({
    name:joi.string().optional().max(15).min(3),
    file:generalFields.file.optional(),
    sunCategoryId:joi.string()
    // file:joi.array().items(generalFields.file.required()).required(),
}).required()