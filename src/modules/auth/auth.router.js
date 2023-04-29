import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as controller from './auth.controller.js'
import * as validators from './auth.validation.js'
import { validation } from "../../middleware/validation.js";

const router = Router()

router.post('/signup',validation(validators.signup),asyncHandler(controller.signup))
router.get('/confirmemail/:token',asyncHandler(controller.confirmemail))
router.post('/login',asyncHandler(controller.login))
router.get('/sendcode', asyncHandler(controller.sendCode))
router.post('/resetpassword', asyncHandler(controller.resetPassword))

export default router