import { Router } from "express";
import auth from "../../middleware/auth.js";
const router = Router()
import * as cartController from './cart.controller.js'
import { asyncHandler } from "../../utils/errorHandling.js";





router.post('/addCart', auth(), asyncHandler(cartController.addToCart))



export default router