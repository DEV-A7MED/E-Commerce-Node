import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addReviewSchema=Joi.object({
    text:Joi.string().optional(),
    rate:Joi.number().min(1).max(5).required(),
    productId:generalFields.id
}).required()