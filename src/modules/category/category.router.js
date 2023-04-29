import { Router } from "express";
import * as controller from './category.controller.js'
import { fileUpload } from "../../utils/multer.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from '../category/category.validation.js'
import subCategoryRouter from '../subcategory/subcategory.router.js'
import brandRouter from '../brand/brand.router.js'
import auth from "../../middleware/auth.js";
import { CategoryEndPoints } from "./category.endPoint.js";
const router = Router()

// when send param in subcategory
router.use('/:categoryId/subCategory', subCategoryRouter)
router.use('/:categoryId/:subCategoryId/brand', brandRouter)


router.post('/',auth(CategoryEndPoints.UPDATE_CATEGORY),fileUpload({}).single('image'),validation(validators.creatCategorySchema) ,asyncHandler( controller.creatCategory) )
router.put('/:categoryId',auth(CategoryEndPoints.UPDATE_CATEGORY),fileUpload({}).single('image'),validation(validators.updateCategorySchema) ,asyncHandler( controller.updateCategory) )
router.get('/',asyncHandler(controller.getAllCategory))

export default router