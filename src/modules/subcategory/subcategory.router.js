import { Router } from "express";
import { fileUpload } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as subCatCont from './subCategory.controller.js'
import { createSubCategorySchema, updateSubCategorySchema } from "./subcategory.validation.js";
import auth from "../../middleware/auth.js";
import { endPoints } from "./subcategory.endPoint.js";
const router = Router({mergeParams:true,caseSensitive:true})




router.post('/createSubCat',auth(endPoints.CREAT_SUB_CATEGORY),fileUpload({}).single('image'),validation(createSubCategorySchema),asyncHandler(subCatCont.createSubCategory))
router.put('/updateSubCategory/:subCategoryId',auth(endPoints.UPDATE_SUB_CATEGORY),fileUpload({}).single('image'),validation(updateSubCategorySchema),asyncHandler(subCatCont.updateSubCategory))
router.get('/',asyncHandler(subCatCont.getAllSubCategories))





export default router