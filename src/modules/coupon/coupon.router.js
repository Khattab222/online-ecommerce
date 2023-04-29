import { Router } from "express";
import * as controllers from './controller/coupon.controller.js'
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './coupon.validation.js'
import auth from "../../middleware/auth.js";
import { couponEndPoints } from "./coupon.endPoint.js";

const router = Router();


router.post('/',auth(couponEndPoints.CREAT_COUPON),validation(validators.creatCouponSchema),asyncHandler(controllers.createCoupon))
router.put('/:couponId',auth(),validation(validators.updateCouponSchema),asyncHandler(controllers.updatecoupon))



export default router