import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import auth from "../../middleware/auth.js";
import * as orderControllers from './order.controller.js'
import { endPoints } from "./order.endPoint.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { cancelOrder, createOrder } from "./order.validation.js";

const router = Router()

router.post('/createOrder', auth(endPoints.CREAT_ORDER), validation(createOrder), asyncHandler(orderControllers.createOrder))
router.patch('/:orderId', auth(endPoints.CACNCEL_ORDER), validation(cancelOrder), asyncHandler(orderControllers.cancelOrder))


export default router