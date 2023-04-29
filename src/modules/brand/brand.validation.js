import joi from "joi";
import { generalFields } from "../../middleware/validation.js";



export const addBrandSchema = joi.object({
    name:joi.string().required().max(15).min(3),
    file:generalFields.file.required(),
    subCategoryId:generalFields.id.required(),
    categoryId:generalFields.id.required()
    // file:joi.array().items(generalFields.file.required()).required(),
}).required()


