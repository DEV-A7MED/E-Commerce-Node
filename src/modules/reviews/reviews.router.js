import { Router } from "express";
const router = Router()
import * as controllers from './reviews.controller.js'
import auth from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { addReviewSchema } from "./reviews.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";



router.post('/:productId', auth(),validation(addReviewSchema), asyncHandler(controllers.addReview))




export default router