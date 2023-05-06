import { Router } from "express";
const router = Router()
import * as prodCont from './product.controller.js'
import { fileUpload } from "../../utils/multer.js";
import auth from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import { Headers, addProductSchema } from "./product.validation.js";


router.post('/addProduct',validation(Headers, true),auth(),
    fileUpload({}).fields([{ name: 'mainImage', maxCount: 1 }, { name: "subImages", maxCount: 2 }]),
    validation(addProductSchema),
    asyncHandler(prodCont.adProduct)
)
router.put('/:productId',
    validation(Headers, true),
    auth(),
    fileUpload({}).fields([{ name: 'mainImage', maxCount: 1 }, { name: "subImages", maxCount: 2 }]),
    validation(addProductSchema),
    asyncHandler(prodCont.updateProduct)
)

router.get('/', asyncHandler(prodCont.productList))

export default router