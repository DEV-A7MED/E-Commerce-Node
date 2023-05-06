import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as catCont from './category.controller.js'
import { fileUpload } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import { createCategorySchema, updateCategorySchema } from "./category.validation.js";
import subCategoryRouter from '../subcategory/subcategory.router.js'
import brandRouter from '../brand/brand.router.js'
import auth from "../../middleware/auth.js";
import { endPoints } from "./category.endPoint.js";

const router = Router({caseSensitive:true})
router.use('/:categoryId/subCategory',subCategoryRouter)
router.use('/:categoryId/:subCategoryId/brand', brandRouter)

router.post('/createCategory',auth(endPoints.CREAT_CATEGORY),fileUpload({}).single('image'),validation(createCategorySchema),asyncHandler(catCont.createCategory))

router.put('/updateCategory/:categoryId',auth(endPoints.UPDATE_CATEGORY),fileUpload({}).single('image'),validation(updateCategorySchema),asyncHandler(catCont.updateCategory))

router.get('/',asyncHandler(catCont.getAllCategories))

export default router