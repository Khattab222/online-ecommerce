import { Router } from "express";
import auth from './../../middleware/auth.js';
import { asyncHandler } from "../../utils/errorHandling.js";
import * as controller from './controller.js'
import { cartEndPoints } from "./cart.endPoint.js";
const router = Router()




router.get('/', (req ,res)=>{
    res.status(200).json({message:"Cart Module"})
})

router.post('/',auth(cartEndPoints.ADD_CART),asyncHandler(controller.addToCart))
router.patch('/remove',auth(cartEndPoints.ADD_CART),asyncHandler(controller.deleteItems))
router.patch('/clear',auth(cartEndPoints.ADD_CART),asyncHandler(controller.emptyCart))


export default router