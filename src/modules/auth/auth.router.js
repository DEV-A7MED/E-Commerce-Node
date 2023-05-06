import { Router } from "express";
const router = Router({caseSensitive:true})
import * as authController from './auth.controller.js'
import { fileUpload } from "../../utils/multer.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import { logInSchema, signUpSchema } from "./auth.validation.js";

router.post('/signUp',fileUpload({}).single('image'),validation(signUpSchema),asyncHandler(authController.signUp))
router.get('/confirmEmail/:token',asyncHandler(authController.confirmEmail))

router.post('/login', validation(logInSchema), asyncHandler(authController.login))

router.get('/sendcode', asyncHandler(authController.sendCode))
router.put('/resetPass', asyncHandler(authController.resetPassword))



export default router