import { Router } from "express";
const router = Router({caseSensitive:true})

import * as couponCont from './coupon.controller.js'
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import { createCouponSchema, updateCouponSchema } from "./coupon.validation.js";
import Auth from "../../middleware/auth.js";
import { endPoints } from "./coupon.endPoint.js";



router.post('/addCoupon',Auth(endPoints.CREAT_COUPON),validation(createCouponSchema),asyncHandler(couponCont.addCoupon))
router.post('/updateCoupon',Auth(endPoints.UPDATE_COUPON),validation(updateCouponSchema),asyncHandler(couponCont.updateCoupon))





export default router