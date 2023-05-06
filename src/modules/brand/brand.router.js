import { Router } from "express";
const router = Router({mergeParams:true,caseSensitive:true})

import * as brandCont from './brand.controller.js'
import { fileUpload } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import { addBrandSchema } from "./brand.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import auth from "../../middleware/auth.js";
import { endPoints } from "./brand.endPoint.js";

router.post("/addBrand",auth(endPoints.CREAT_BRAND),fileUpload({}).single('image'),validation(addBrandSchema),asyncHandler(brandCont.addBrand))





export default router