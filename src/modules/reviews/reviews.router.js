import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as reviewController from './controller/review.controller.js'
import auth from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './reviews.validation.js'
import {endpoint}from './reviews.endPoint.js'
const router = Router({mergeParams:true})




router.post('/',auth(endpoint.creatReview),validation(validators.creatReview),asyncHandler(reviewController.creatReview))
router.put('/:reviewId',auth(endpoint.updateReview),validation(validators.updateReview),asyncHandler(reviewController.updateReview))




export default router