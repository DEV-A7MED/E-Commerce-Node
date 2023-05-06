
import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const createCouponSchema = Joi.object({
    code: Joi.string().min(4).max(10).required().alphanum(),
    amount: Joi.number().min(1).required(),
    validFrom: Joi.string().required(),
    expiredDate: Joi.string().required(),
    usagePerUser: Joi.array().items(
        Joi.object({
            userId: generalFields.id,
            maxUsage: Joi.number().integer().positive().required(),
        }).required()
    ).required()
}).required()


export const updateCouponSchema = Joi.object({
    code: Joi.string().min(4).max(10).optional().alphanum(),
    amount: Joi.number().min(1).optional(),
    validFrom: Joi.string().optional(),
    expiredDate: Joi.string().optional(),
    couponId: generalFields.id.required()
}).required()