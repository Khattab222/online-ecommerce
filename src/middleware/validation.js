import joi from 'joi'
import { Types } from 'mongoose';


const opjectIdValidation = (value,helper) => {
    // console.log({value,helper});
  return  Types.ObjectId.isValid(value)? true: helper.message('please enter valid _id')
}


export const generalFields = {
    email: joi.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: { allow: ['com', 'net',] }
    }).required(),
    password: joi.string().required(),
    cPassword: joi.string().valid(joi.ref('password')).required(),
    id:joi.string().custom(opjectIdValidation).required(),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required()
    })
}

export const validation = (schema,isHeadersSent=false) => {
    return (req, res, next) => {

        const requestData = { ...req.body, ...req.params, ...req.query }
        if (req.file || req.files) { requestData.file = req.file || req.files }
        if (req.headers?.authorization && isHeadersSent) requestData = { authorization: req.headers.authorization }

        const validationResult = schema.validate(requestData, { abortEarly: false })
        if (validationResult?.error) {
            return res.json({ message: "Validation Err", validationErr: validationResult.error.details })
        }
        return next()
    }
}