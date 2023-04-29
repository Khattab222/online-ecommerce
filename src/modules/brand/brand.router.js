import { Router } from "express";
const router = Router({mergeParams:true})
import * as controllers from './controller/controller.js'
import { fileUpload } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";

import * as validators from './brand.validation.js'
import auth from "../../middleware/auth.js";
import { brandEndPoints } from "./brand.endPoint.js";



router.post('/add',auth(brandEndPoints.CREAT_BRAND),fileUpload({}).single('logo'),validation(validators.addBrandSchema),asyncHandler(controllers.addBrand))



export default router