import joi from "joi";
import { generalFields } from "../../middleware/validation.js";



export const creatReview = joi.object({
    comment:joi.string().required().min(2).max(1500),
    rating:joi.number().min(1).max(5).required(),
    productId:generalFields.id
}).required()



export const updateReview = joi.object({
    comment:joi.string().required().min(2).max(1500),
    rating:joi.number().min(1).max(5).required(),
    productId:generalFields.id,
    reviewId:generalFields.id,
}).required()