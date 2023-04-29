import { Router } from "express";
import auth from "../../middleware/auth.js";
import * as controllers from './order.controller.js'
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './order.validation.js'
import { orderEndPoints } from "./order.endPoint.js";
const router = Router()




router.get('/', (req ,res)=>{
    res.status(200).json({message:"order Module"})
})
router.post('/',auth(),validation(validators.creatOrder),asyncHandler(controllers.creatOrder))
router.patch('/:orderId',auth(orderEndPoints.CANCEL_ORDER),validation(validators.cancelOrder),asyncHandler(controllers.cancelOrder))




export default router