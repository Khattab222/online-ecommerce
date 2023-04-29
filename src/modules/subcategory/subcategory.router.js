import { Router } from "express";
import * as controller from './subcategory.controller.js'
import { validation } from "../../middleware/validation.js";
import { fileUpload } from "../../utils/multer.js";
import  * as validators from './subcategory.validation.js'
import { asyncHandler } from "../../utils/errorHandling.js";
import auth from "../../middleware/auth.js";
import { subCategoryEndPoints } from "./subcategory.endPoint.js";
const router = Router({mergeParams:true})




router.post('/',auth(subCategoryEndPoints.CREAT_SUB_CATEGORY),fileUpload({}).single('image'),validation(validators.creatsubCategorySchema) ,asyncHandler( controller.creatSubCategory) )
router.put('/:sunCategoryId',auth(subCategoryEndPoints.UPDATE_SUB_CATEGORY),fileUpload({}).single('image'),validation(validators.updateSubCategorySchema) ,asyncHandler( controller.updateSubCategory) )





export default router